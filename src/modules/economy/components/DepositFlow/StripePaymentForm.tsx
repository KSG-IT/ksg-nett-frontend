import { Button, Stack, Text } from '@mantine/core'
import { IconLock } from '@tabler/icons-react'
import { PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js'
import { MessageBox } from 'components/MessageBox'
import { OngoingDeposit } from 'modules/economy/types.graphql'
import { useState } from 'react'
import { useCurrencyFormatter, useMe } from 'util/hooks'
import { useCancelDeposit } from './useCancelDeposit'

interface StripePaymentFormProps {
  deposit: OngoingDeposit
  onCancelled: () => void
}

function statusUrl(depositId: string) {
  return `${import.meta.env.VITE_APP_URL}/economy/deposits/${depositId}/status`
}

/**
 * Confirms the payment with Stripe. On success Stripe redirects to the status
 * page, so the code after confirmPayment only runs for an error.
 */
export const StripePaymentForm: React.FC<StripePaymentFormProps> = ({
  deposit,
  onCancelled,
}) => {
  const stripe = useStripe()
  const elements = useElements()
  const me = useMe()
  const { formatCurrency } = useCurrencyFormatter()
  const { cancelDeposit, cancelDepositLoading } = useCancelDeposit()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (!stripe || !elements) return

    setSubmitting(true)
    setErrorMessage(null)
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: statusUrl(deposit.id),
        payment_method_data: {
          billing_details: { email: me.email, name: me.getCleanFullName },
        },
      },
    })
    setErrorMessage(error.message ?? 'Betalingen gikk ikke gjennom')
    setSubmitting(false)
  }

  return (
    <form onSubmit={handleSubmit}>
      <Stack gap="md">
        <PaymentElement />
        {errorMessage && (
          <MessageBox type="danger">
            <Text size="sm">{errorMessage}</Text>
          </MessageBox>
        )}
        <Text size="sm" c="dimmed" px={4}>
          Banken din kan be deg bekrefte betalingen i BankID eller bankappen.
        </Text>
        <Stack gap={4}>
          <Button
            type="submit"
            size="lg"
            fullWidth
            disabled={!stripe || !elements}
            loading={submitting}
            leftSection={<IconLock size={18} />}
          >
            Betal {formatCurrency(deposit.amount)}
          </Button>
          <Button
            variant="subtle"
            loading={cancelDepositLoading}
            disabled={submitting}
            onClick={() => cancelDeposit(deposit.id, onCancelled)}
          >
            Avbryt innskudd
          </Button>
        </Stack>
      </Stack>
    </form>
  )
}
