import { zodResolver } from '@hookform/resolvers/zod'
import { Button, NumberInput, Paper, Stack, Text } from '@mantine/core'
import { DatePickerInput } from '@mantine/dates'
import { showNotification } from '@mantine/notifications'
import { IconCalendar } from '@tabler/icons-react'
import 'dayjs/locale/nb'
import {
  SOCIETETEN_ACCOUNT_NUMBER,
  depositAmountSchema,
} from 'modules/economy/deposit'
import { DepositMethodValues } from 'modules/economy/enums'
import { useDepositMutations } from 'modules/economy/mutations.hooks'
import { Controller, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { format } from 'util/date-fns'
import { useMe } from 'util/hooks'
import { z } from 'zod'
import { CopyRow } from './CopyRow'

const bankTransferSchema = z.object({
  amount: depositAmountSchema,
  dateOfTransfer: z.string().min(1, 'Velg dato'),
})

type BankTransferFormData = z.infer<typeof bankTransferSchema>

interface BankTransferFormProps {
  initialAmount: number
}

/**
 * A bank transfer is approved by hand when the economy manager sees it on the
 * account. The name in the transfer message tells who sent it.
 */
export const BankTransferForm: React.FC<BankTransferFormProps> = ({
  initialAmount,
}) => {
  const me = useMe()
  const navigate = useNavigate()
  const { createDeposit, createDepositLoading } = useDepositMutations()
  const { control, handleSubmit, formState } = useForm<BankTransferFormData>({
    mode: 'onChange',
    defaultValues: {
      amount: initialAmount,
      dateOfTransfer: format(new Date(), 'yyyy-MM-dd'),
    },
    resolver: zodResolver(bankTransferSchema),
  })

  function handleRegister({ amount, dateOfTransfer }: BankTransferFormData) {
    createDeposit({
      variables: {
        amount,
        depositMethod: DepositMethodValues.BANK_TRANSFER,
        description: format(new Date(dateOfTransfer), 'd. MMMM'),
      },
      onCompleted({ createDeposit }) {
        navigate(`/economy/deposits/${createDeposit.deposit.id}/status`)
      },
      onError({ message }) {
        showNotification({ title: 'Noe gikk galt', message, color: 'red' })
      },
    })
  }

  return (
    <form onSubmit={handleSubmit(handleRegister)}>
      <Stack gap="md">
        <CopyRow
          label="1 · Overfør til Societeten"
          value={SOCIETETEN_ACCOUNT_NUMBER}
        />
        <CopyRow
          label="2 · Skriv dette i meldingsfeltet"
          value={me.getCleanFullName}
        >
          <Text size="sm" c="orange.9">
            Uten navnet ditt i meldingen kan vi ikke se hvem overføringen er
            fra, og innskuddet blir ikke godkjent.
          </Text>
        </CopyRow>
        <Paper withBorder radius="lg" p="lg">
          <Stack gap="sm">
            <Text size="sm" c="dimmed">
              3 · Registrer overføringen her
            </Text>
            <Controller
              name="amount"
              control={control}
              render={({ field, fieldState }) => (
                <NumberInput
                  label="Beløp"
                  hideControls
                  allowDecimal={false}
                  allowNegative={false}
                  thousandSeparator=" "
                  rightSection={<Text c="dimmed">kr</Text>}
                  // NaN when empty, see AmountPicker
                  value={Number.isNaN(field.value) ? '' : field.value}
                  onChange={amount =>
                    field.onChange(typeof amount === 'number' ? amount : NaN)
                  }
                  error={fieldState.error?.message}
                />
              )}
            />
            <Controller
              name="dateOfTransfer"
              control={control}
              render={({ field }) => (
                <DatePickerInput
                  label="Dato for overføring"
                  leftSection={<IconCalendar size={16} />}
                  locale="nb"
                  valueFormat="D. MMMM"
                  clearable={false}
                  maxDate={new Date()}
                  value={field.value}
                  onChange={value => value && field.onChange(value)}
                />
              )}
            />
          </Stack>
        </Paper>
        <Text size="sm" c="dimmed" px={4}>
          Ingen gebyr. Pengene kommer på kontoen når økonomiansvarlig har sett
          overføringen på konto, som regel innen 1–2 virkedager.
        </Text>
        <Button
          type="submit"
          size="lg"
          fullWidth
          disabled={!formState.isValid}
          loading={createDepositLoading}
        >
          Registrer overføring
        </Button>
      </Stack>
    </form>
  )
}
