import { useQuery } from '@apollo/client'
import { Group, Paper, Stack, Text } from '@mantine/core'
import { Elements } from '@stripe/react-stripe-js'
import { Appearance, loadStripe } from '@stripe/stripe-js'
import { FullPageError } from 'components/FullPageComponents'
import { FullContentLoader } from 'components/Loading'
import {
  DEPOSIT_CLIENT_SECRET_QUERY,
  STRIPE_CUSTOMER_SESSION_QUERY,
} from 'modules/economy/queries'
import {
  DepositClientSecretReturns,
  DepositClientSecretVariables,
  OngoingDeposit,
  StripeCustomerSessionReturns,
} from 'modules/economy/types.graphql'
import { useCurrencyFormatter } from 'util/hooks'
import { StripePaymentForm } from './StripePaymentForm'

// This module is loaded lazily, so Stripe.js loads on the payment step only
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)

const appearance: Appearance = {
  theme: 'stripe',
  variables: {
    colorPrimary: '#A03033',
    borderRadius: '10px',
    fontFamily: 'Inter, "Open Sans", Helvetica, Arial, sans-serif',
  },
}

interface StripePaymentProps {
  deposit: OngoingDeposit
  onCancelled: () => void
}

const StripePayment: React.FC<StripePaymentProps> = ({
  deposit,
  onCancelled,
}) => {
  const { formatCurrency } = useCurrencyFormatter()
  const { data, loading, error } = useQuery<
    DepositClientSecretReturns,
    DepositClientSecretVariables
  >(DEPOSIT_CLIENT_SECRET_QUERY, {
    variables: { depositId: deposit.id },
    fetchPolicy: 'network-only',
  })
  // Saved cards are optional: an error, for example an older backend without
  // the field, shows the Payment Element without them
  const customerSession = useQuery<StripeCustomerSessionReturns>(
    STRIPE_CUSTOMER_SESSION_QUERY,
    { fetchPolicy: 'network-only', errorPolicy: 'all' }
  )

  if (error) return <FullPageError />
  if (loading || !data || customerSession.loading) return <FullContentLoader />

  const clientSecret = data.getClientSecretFromDepositId
  if (!clientSecret) return <FullPageError />

  const fee = deposit.amount - (deposit.resolvedAmount ?? 0)

  return (
    <Stack gap="md">
      <Paper withBorder radius="lg" p="lg">
        <Group justify="space-between" align="center">
          <Stack gap={2}>
            <Text size="sm" c="dimmed">
              Kommer på konto
            </Text>
            <Text fz={28} fw={800}>
              {formatCurrency(deposit.resolvedAmount ?? 0)}
            </Text>
          </Stack>
          <Stack gap={2} align="flex-end">
            <Text size="sm" c="dimmed">
              Du betaler
            </Text>
            <Text fw={700}>{formatCurrency(deposit.amount)}</Text>
            <Text size="xs" c="dimmed">
              inkl. {formatCurrency(fee)} gebyr
            </Text>
          </Stack>
        </Group>
      </Paper>
      <Elements
        stripe={stripePromise}
        options={{
          clientSecret,
          customerSessionClientSecret:
            customerSession.data?.stripeCustomerSessionClientSecret ??
            undefined,
          appearance,
          locale: 'nb',
        }}
      >
        <StripePaymentForm deposit={deposit} onCancelled={onCancelled} />
      </Elements>
    </Stack>
  )
}

export default StripePayment
