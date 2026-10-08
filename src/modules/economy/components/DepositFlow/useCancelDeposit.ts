import { showNotification } from '@mantine/notifications'
import { useDepositMutations } from 'modules/economy/mutations.hooks'
import { ONGOING_DEPOSIT_INTENT_QUERY } from 'modules/economy/queries'

/**
 * Deletes an unpaid card deposit. The backend cancels the payment at Stripe,
 * and refuses when the payment went through or is still processing.
 */
export function useCancelDeposit() {
  const { deleteDeposit, deleteDepositLoading } = useDepositMutations()

  function cancelDeposit(depositId: string, onCancelled?: () => void) {
    deleteDeposit({
      variables: { id: depositId },
      refetchQueries: [ONGOING_DEPOSIT_INTENT_QUERY],
      awaitRefetchQueries: true,
      onCompleted() {
        onCancelled?.()
      },
      onError({ message }) {
        showNotification({
          title: 'Kunne ikke avbryte innskuddet',
          message,
          color: 'red',
        })
      },
    })
  }

  return { cancelDeposit, cancelDepositLoading: deleteDepositLoading }
}
