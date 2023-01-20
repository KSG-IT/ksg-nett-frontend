import { showNotification } from '@mantine/notifications'
import { usePatchDocumentMutations } from 'modules/handbook/mutations'
import { DocumentNode } from '../../types.graphql'
import { useNavigate } from 'react-router-dom'
import { DocumentCleanedData } from './useDocumentLogic'
import { ALL_DOCUMENTS_QUERY, DOCUMENT_DETAIL_QUERY } from '../../queries'

export function useDocumentFormAPI(
  document?: DocumentNode,
  onCompletedCallback?: () => void
) {
  const { patchDocument, createDocument } = usePatchDocumentMutations()
  const navigate = useNavigate()

  async function handleSubmit(data: DocumentCleanedData) {
    if (document) {
      const input = {
        ...data,
      }
      const { id } = document

      return patchDocument({
        variables: {
          id: id,
          input: input,
        },
        refetchQueries: [ALL_DOCUMENTS_QUERY, DOCUMENT_DETAIL_QUERY],
        onCompleted({ patchDocument }) {
          showNotification({
            title: 'Vellykket',
            message: 'Dokumentet har blitt oppdatert',
            color: 'green',
          })
          onCompletedCallback?.()
        },
      })
    } else {
      const input = {
        ...data,
      }

      return createDocument({
        variables: {
          input: input,
        },
        refetchQueries: [ALL_DOCUMENTS_QUERY],
        onCompleted: data => {
          showNotification({
            title: 'Vellykket',
            message: 'Dokumentet ble opprettet',
          })
          navigate(`/handbook/document/${data.createDocument.document.id}`)
        },
        onError({ message }) {
          showNotification({
            title: 'Noe gikk galt',
            message: message,
          })
        },
      })
    }
  }

  const defaultValues = {
    name: document?.name || '',
    content: document?.content || '',
  }
  return {
    defaultValues,
    onSubmit: handleSubmit,
  }
}
