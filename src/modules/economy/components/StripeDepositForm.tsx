import { Button, Stack } from '@mantine/core'
import { PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js'
import { useEffect, useState } from 'react'
import { useMe } from 'util/hooks'

interface StripeDepositFormProps {
  clientSecret: string
  onCompleted?: () => void
}

export const StripeDepositForm: React.FC<StripeDepositFormProps> = ({
  clientSecret,
  onCompleted,
}) => {
  /**
   * Implementation is basically a copy of the example from
   * the documentation. SHould probably be improved.
   */
  const stripe = useStripe()
  const elements = useElements()
  const me = useMe()
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!stripe || !clientSecret) return

    stripe.retrievePaymentIntent(clientSecret)
  }, [stripe])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return
    }

    setIsLoading(true)
    const { error } = await stripe.confirmPayment({
      elements,

      confirmParams: {
        return_url: import.meta.env.VITE_APP_URL + '/economy/me',
        // setup_future_usage: 'off_session',  // Use this to save card for future use. Need to refactor it
        // form flow before implementing this.
        payment_method_data: {
          billing_details: {
            email: me.email,
            name: me.fullName,
            phone: me.phone,
          },
        },
      },
    })

    if (!error) {
      setIsLoading(false)
      onCompleted && onCompleted()

      return
    }
    if (error.type === 'card_error' || error.type === 'validation_error') {
      error.message && console.error(error.message)
    } else {
      console.error('Error:', error)
    }

    setIsLoading(false)
  }

  return (
    <form id="payment-form" onSubmit={handleSubmit}>
      <Stack>
        <PaymentElement />
        <Button
          disabled={isLoading || !stripe || !elements}
          id="submit"
          loading={isLoading}
          type="submit"
        >
          Betal
        </Button>
      </Stack>
    </form>
  )
}
