import { InternalGroupUserHighlightNode } from 'modules/organization/types'
import { useInternalGroupUserHighlightMutations } from 'modules/organization/mutations.hooks'
import { HighlightFormData } from './useEditHighlightLogic'
import { INTERNAL_GROUP_USER_HIGHLIGHTS_BY_INTERNAL_GROUP_QUERY } from 'modules/organization/queries'
import { showNotification } from '@mantine/notifications'

interface UseEditHighlightAPIInput {
  highlight?: InternalGroupUserHighlightNode
  onCompletedCallback?: () => void
}

export function useEditHighlightAPI({
  highlight,
  onCompletedCallback,
}: UseEditHighlightAPIInput) {
  const { patchInternalGroupUserHighlight, createInternalGroupUserHighlight } =
    useInternalGroupUserHighlightMutations()

  async function handleSubmit(data: HighlightFormData) {
    if (highlight) {
      const input = {
        ...data,
      }

      const { id } = highlight
      return patchInternalGroupUserHighlight({
        variables: {
          id: id,
          input: input,
        },
        refetchQueries: [
          INTERNAL_GROUP_USER_HIGHLIGHTS_BY_INTERNAL_GROUP_QUERY,
        ],
        onCompleted: data => {
          showNotification({
            title: 'Vellykket',
            message: 'Beskrivelsen har blitt oppdatert',
            color: 'green',
          })
          onCompletedCallback?.()
        },
      })
    } else {
      const input = {
        ...data,
      }

      return createInternalGroupUserHighlight({
        variables: {
          input: input,
        },
        refetchQueries: [
          INTERNAL_GROUP_USER_HIGHLIGHTS_BY_INTERNAL_GROUP_QUERY,
        ],
        onCompleted: data => {
          showNotification({
            title: 'Vellykket',
            message: 'Innslaget ble opprettet',
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
    }
  }

  const defaultValues = {
    user: highlight?.user.id ?? '',
    internalGroup: highlight?.internalGroup.id ?? '',
    occupation: highlight?.occupation ?? '',
    description: highlight?.description ?? '',
    archived: highlight?.archived ?? false,
  }
  return {
    defaultValues,
    onSubmit: handleSubmit,
  }
}
