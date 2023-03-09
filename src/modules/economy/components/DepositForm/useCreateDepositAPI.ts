import { showNotification } from '@mantine/notifications'
import { DepositMethodValues } from 'modules/economy/enums'
import { useDepositMutations } from 'modules/economy/mutations.hooks'
import { CreateDepositMutationVariables } from 'modules/economy/types.graphql'
import { ONGOING_DEPOSIT_INTENT_QUERY } from 'modules/economy/views'
import { useNavigate } from 'react-router-dom'
import { CreateDepositFormData } from './useCreateDepositLogic'

export function useCreateDepositAPI(onCompletedCallback: () => void) {
  const { createDeposit } = useDepositMutations()
  const navigate = useNavigate()

  async function handleSubmit(data: CreateDepositMutationVariables) {
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
        if (data.depositMethod === DepositMethodValues.BANK_TRANSFER) {
          navigate('/economy/me')
        }
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
    amount: 50,
    dateOfTransfer: new Date(),
    depositMethod: DepositMethodValues.STRIPE,
  }
  return {
    defaultValues,
    onSubmit: handleSubmit,
  }
}
