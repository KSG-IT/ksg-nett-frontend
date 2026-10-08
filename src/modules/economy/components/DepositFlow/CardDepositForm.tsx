import { useQuery } from '@apollo/client'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Paper, Stack, Text } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { IconArrowRight } from '@tabler/icons-react'
import {
  cardDepositAmounts,
  depositAmountSchema,
} from 'modules/economy/deposit'
import { DepositMethodValues } from 'modules/economy/enums'
import { useDepositMutations } from 'modules/economy/mutations.hooks'
import {
  ONGOING_DEPOSIT_INTENT_QUERY,
  STRIPE_DEPOSIT_FEE_QUERY,
} from 'modules/economy/queries'
import { StripeDepositFeeReturns } from 'modules/economy/types.graphql'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { AmountPicker } from './AmountPicker'
import { FeeSummary } from './FeeSummary'

const cardDepositSchema = z.object({ amount: depositAmountSchema })

type CardDepositFormData = z.infer<typeof cardDepositSchema>

interface CardDepositFormProps {
  initialAmount: number
  onCreated: () => void
}

/** Creates the card deposit. The payment itself is the next step */
export const CardDepositForm: React.FC<CardDepositFormProps> = ({
  initialAmount,
  onCreated,
}) => {
  const { data } = useQuery<StripeDepositFeeReturns>(STRIPE_DEPOSIT_FEE_QUERY)
  const { createDeposit, createDepositLoading } = useDepositMutations()
  const { control, handleSubmit, watch, formState } =
    useForm<CardDepositFormData>({
      mode: 'onChange',
      defaultValues: { amount: initialAmount },
      resolver: zodResolver(cardDepositSchema),
    })

  const amount = watch('amount')
  const fee = data?.stripeDepositFee
  const amounts =
    fee && formState.isValid ? cardDepositAmounts(amount, fee) : null

  function handleCreate({ amount }: CardDepositFormData) {
    createDeposit({
      variables: {
        amount,
        depositMethod: DepositMethodValues.STRIPE,
        description: '',
      },
      refetchQueries: [ONGOING_DEPOSIT_INTENT_QUERY],
      awaitRefetchQueries: true,
      onCompleted: onCreated,
      onError({ message }) {
        showNotification({ title: 'Noe gikk galt', message, color: 'red' })
      },
    })
  }

  return (
    <form onSubmit={handleSubmit(handleCreate)}>
      <Stack gap="md">
        <Paper withBorder radius="lg" p="lg">
          <Controller
            name="amount"
            control={control}
            render={({ field, fieldState }) => (
              <AmountPicker
                value={field.value}
                onChange={field.onChange}
                error={fieldState.error?.message}
              />
            )}
          />
        </Paper>
        {fee && <FeeSummary amounts={amounts} fee={fee} />}
        <Text size="sm" c="dimmed" px={4}>
          Bankoverføring er gratis, men tar 1–2 virkedager. Kortbetaling går via
          Stripe, og KSG-nett lagrer aldri kortnummeret ditt.
        </Text>
        <Button
          type="submit"
          size="lg"
          fullWidth
          disabled={!formState.isValid}
          loading={createDepositLoading}
          rightSection={<IconArrowRight size={18} />}
        >
          Fortsett til betaling
        </Button>
      </Stack>
    </form>
  )
}
