import { gql, useQuery } from '@apollo/client'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { StripeDepositForm } from './StripeDepositForm'

interface StripeDepositPaymentFormProps {
  depositId: string
  onCompletedCallback?: () => void
}

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)

const GET_CLIENT_SECRET_FROM_DEPOSIT_ID = gql`
  query GetClientSecretFromDepositId($depositId: ID!) {
    getClientSecretFromDepositId(depositId: $depositId)
  }
`

export const StripeDepositPaymentForm: React.FC<
  StripeDepositPaymentFormProps
> = ({ depositId, onCompletedCallback }) => {
  const { data, loading, error } = useQuery(GET_CLIENT_SECRET_FROM_DEPOSIT_ID, {
    variables: {
      depositId: depositId,
    },
  })

  if (loading || !data) return <p>Loading</p>

  const { getClientSecretFromDepositId } = data

  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret: getClientSecretFromDepositId,
      }}
    >
      <StripeDepositForm
        clientSecret={getClientSecretFromDepositId}
        onCompleted={onCompletedCallback}
      />
    </Elements>
  )
}
