import { showNotification } from '@mantine/notifications'
import { useNavigate } from 'react-router-dom'
import { usePatchSummaryMutations } from '../../mutations'
import { ALL_SUMMARIES, SUMMARY_QUERY } from '../../queries'
import { SummaryNode } from '../../types'
import { SummaryCleanedData } from './useSummaryLogic'
import { useMe } from 'util/hooks'

export function useSummaryFormAPI(
  summary?: SummaryNode,
  onCompletedCallback?: () => void
) {
  const { patchSummary, createSummary } = usePatchSummaryMutations()
  const navigate = useNavigate()
  const me = useMe()

  async function handleSubmit(data: SummaryCleanedData) {
    if (summary) {
      const input = {
        ...data,
      }
      const { id } = summary

      return patchSummary({
        variables: {
          id: id,
          input: input,
        },
        refetchQueries: [ALL_SUMMARIES, SUMMARY_QUERY],
        onCompleted({ patchSummary }) {
          showNotification({
            title: 'Vellykket',
            message: 'Referatet har blitt oppdatert',
            color: 'green',
          })
          onCompletedCallback?.()
        },
      })
    } else {
      const input = {
        ...data,
      }

      return createSummary({
        variables: {
          input: input,
        },
        refetchQueries: [ALL_SUMMARIES],
        onCompleted: data => {
          showNotification({
            title: 'Vellykket',
            message: 'Referatet ble opprettet',
          })
          navigate(`/summaries/${data.createSummary.summary.id}`)
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
    contents: summary?.contents ?? '',
    internalGroup: summary?.internalGroup?.id ?? 'other',
    title: summary?.title ?? '',
    participants: summary?.participants.map(user => user.id) ?? [],
    reporter: summary?.reporter.id ?? me.id,
    date: (summary?.date && new Date(summary.date)) ?? new Date(),
  }
  return {
    defaultValues,
    onSubmit: handleSubmit,
  }
}
