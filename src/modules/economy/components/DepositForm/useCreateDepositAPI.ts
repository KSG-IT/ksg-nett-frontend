import { showNotification } from '@mantine/notifications'
import { DepositMethodValues } from 'modules/economy/enums'
import { useDepositMutations } from 'modules/economy/mutations.hooks'
import { ONGOING_DEPOSIT_INTENT_QUERY } from 'modules/economy/views'
import { CreateDepositFormData } from './useCreateDepositLogic'

export function useCreateDepositAPI(onCompletedCallback: () => void) {
  const { createDeposit } = useDepositMutations()

  async function handleSubmit(data: CreateDepositFormData) {
    return createDeposit({
      variables: {
        ...data,
      },
      refetchQueries: [ONGOING_DEPOSIT_INTENT_QUERY],
      onCompleted() {
        showNotification({
          title: 'Suksess',
          message: 'Innskudd har blitt opprettet',
          color: 'Green',
        })
        onCompletedCallback()
      },
      onError({ message }) {
        showNotification({
          title: 'Noe gikk galt',
          message,
        })
      },
    })
  }

  const defaultValues = {
    amount: 0,
    description: '',
    depositMethod: DepositMethodValues.STRIPE,
  }
  return {
    defaultValues,
    onSubmit: handleSubmit,
  }
}
