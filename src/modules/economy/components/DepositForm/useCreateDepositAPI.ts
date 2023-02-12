import { showNotification } from '@mantine/notifications'
import { formatISO } from 'date-fns'
import { useDepositMutations } from 'modules/economy/mutations.hooks'
import { ONGOING_DEPOSIT_INTENT_QUERY } from 'modules/economy/views'
import { CreateDepositFormData } from './useCreateDepositLogic'

export function useCreateDepositAPI(onCompletedCallback: () => void) {
  const { createDeposit } = useDepositMutations()

  async function handleSubmit(data: CreateDepositFormData) {
    const input = {
      ...data,
      createdAt: formatISO(new Date()),
    }
    return createDeposit({
      variables: {
        input: input,
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
    receipt: null,
  }
  return {
    defaultValues,
    onSubmit: handleSubmit,
  }
}
