import {
  Button,
  Group,
  NumberInput,
  SimpleGrid,
  Stack,
  Stepper,
  Text,
  Radio,
  Textarea,
} from '@mantine/core'

import { IconCashBanknote } from '@tabler/icons'
import { MessageBox } from 'components/MessageBox'
import { DepositMethodValues } from 'modules/economy/enums'
import { useDepositMutations } from 'modules/economy/mutations.hooks'
import { DepositNode } from 'modules/economy/types.graphql'
import { ONGOING_DEPOSIT_INTENT_QUERY } from 'modules/economy/views'
import { Controller } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { useCurrencyFormatter, useMediaQuery } from 'util/hooks'
import { StripeDepositPaymentForm } from '../StripeDepositPaymentForm'

import { useCreateDepositAPI } from './useCreateDepositAPI'
import { useCreateDepositLogic } from './useCreateDepositLogic'

interface CreateDepositViewProps {
  onCompletedCallback: () => void
  onGoingIntent: DepositNode | null
}

export const CreateDepositForm: React.FC<CreateDepositViewProps> = ({
  onGoingIntent,
}) => {
  const { form, onSubmit } = useCreateDepositLogic({
    ...useCreateDepositAPI(() => {}),
  })
  const { deleteDeposit, deleteDepositLoading } = useDepositMutations()

  const mobileSize = useMediaQuery('(max-width: 600px)')
  const { formState, handleSubmit, setValue, watch, register } = form
  const { errors, isSubmitting } = formState
  const { formatCurrency } = useCurrencyFormatter()

  const depositMethod = watch('depositMethod')

  // Apparently the rerender for Stepper component does not work with useState.
  // So I'm doing this instead like some deranged person.
  const active = onGoingIntent === null ? 0 : 1

  function handleDeleteDeposit() {
    if (!onGoingIntent) return

    deleteDeposit({
      variables: {
        id: onGoingIntent.id,
      },
      refetchQueries: [ONGOING_DEPOSIT_INTENT_QUERY],
    })
  }

  return (
    <Stack spacing={'lg'} p={mobileSize ? 'xs' : 'xl'}>
      <SimpleGrid cols={1} spacing={'md'}>
        <Stepper active={active} breakpoint="sm" allowNextStepsSelect={false}>
          <Stepper.Step label="Opprett innskudd">
            {depositMethod === DepositMethodValues.BANK_TRANSFER && (
              <MessageBox type="warning">
                <b>Obs!</b> Ved bankoverføring husk å skrive inn navn og dato på
                overøringen i kommentaren <b>nede</b>. Bankoverføringer blir
                heller ikke godkjent før de har blitt bekreftet at de har kommet
                inn på konto. Dette tar som regel noen dager
              </MessageBox>
            )}
            <form onSubmit={handleSubmit(onSubmit)}>
              <Controller
                name="depositMethod"
                control={form.control}
                render={({ field }) => (
                  <Radio.Group
                    value={field.value}
                    label="Betalingsmåte"
                    onChange={value =>
                      setValue('depositMethod', value as DepositMethodValues)
                    }
                  >
                    <Radio
                      label="Kortbetaling"
                      value={DepositMethodValues.STRIPE}
                    />
                    <Radio
                      label="Bankoverføring"
                      value={DepositMethodValues.BANK_TRANSFER}
                    />
                  </Radio.Group>
                )}
              />

              <NumberInput
                hideControls
                size={mobileSize ? 'xs' : 'sm'}
                variant="filled"
                error={errors?.amount?.message}
                label="Beløp å betale"
                required
                min={50}
                max={30_000}
                placeholder="Hvor mye socistøv du vil konvertere"
                icon={<IconCashBanknote size={14} />}
                onChange={value => value && setValue('amount', value)}
              />

              <Textarea
                required
                label="Kommentar"
                placeholder={
                  depositMethod === DepositMethodValues.STRIPE
                    ? 'Legg igjen en hyggelig kommentar'
                    : 'Vennligst skriv fult navn og dato på overføringen'
                }
                {...register('description')}
              />

              <Group position="apart" mt={'md'}>
                <Button
                  variant="outline"
                  color={'samfundet-red'}
                  component={Link}
                  to="/dashboard"
                >
                  Avbryt
                </Button>
                <Button
                  color={'samfundet-red'}
                  size={mobileSize ? 'sm' : 'md'}
                  disabled={isSubmitting}
                  type="submit"
                >
                  Gå til betaling
                </Button>
              </Group>
            </form>
          </Stepper.Step>
          <Stepper.Step label="Betaling">
            {onGoingIntent && (
              <Stack spacing={'xs'}>
                <label style={{ fontSize: 14 }}>Beløp som du betaler</label>
                <Text weight={'bold'}>
                  {formatCurrency(onGoingIntent.amount)}
                </Text>

                <label style={{ fontSize: 14 }}>
                  Beløp som kommer på konto
                </label>
                <Text weight={'bold'}>
                  {formatCurrency(onGoingIntent.resolvedAmount!)}
                </Text>
                <StripeDepositPaymentForm depositId={onGoingIntent.id} />
                <Button
                  color="red"
                  loading={deleteDepositLoading}
                  onClick={handleDeleteDeposit}
                >
                  Avbryt og slett innskudd
                </Button>
              </Stack>
            )}
          </Stepper.Step>
        </Stepper>
      </SimpleGrid>
    </Stack>
  )
}
