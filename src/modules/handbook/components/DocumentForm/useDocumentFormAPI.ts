import { showNotification } from '@mantine/notifications'
import { useDocumentMutations } from 'modules/handbook/mutations.hooks'
import { useNavigate } from 'react-router-dom'
import { ALL_DOCUMENTS_QUERY, DOCUMENT_DETAIL_QUERY } from '../../queries'
import { DocumentNode } from '../../types.graphql'
import { DocumentCleanedData } from './useDocumentLogic'

export function useDocumentFormAPI(
  document?: DocumentNode,
  onCompletedCallback?: () => void
) {
  const { patchDocument, createDocument } = useDocumentMutations()
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
        onCompleted() {
          showNotification({
            title: 'Vellykket',
            message: 'Dokumentet har blitt oppdatert',
            color: 'green',
          })
          onCompletedCallback?.()
        },
        onError({ message }) {
          showNotification({
            title: 'Noe gikk galt',
            message: message,
          })
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
