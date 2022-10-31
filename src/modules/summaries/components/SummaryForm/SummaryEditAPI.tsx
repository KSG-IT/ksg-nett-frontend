import { SummaryNode } from '../../types'
import { SUMMARY_QUERY } from '../../queries'
import { SummaryCleanedData, SummaryFormData } from './SummaryLogic'
import { usePatchSummaryMutations } from '../../mutations'

export function useSummaryEditAPI(summary: SummaryNode) {
  const { patchSummary } = usePatchSummaryMutations()

  async function handleSubmit(data: SummaryCleanedData) {
    const { id } = summary
    const input = {
      ...data,
    }

    return patchSummary({
      variables: {
        id: id,
        input: input,
      },
      refetchQueries: [SUMMARY_QUERY],
    })
  }

  const defaultValues = {
    contents: summary?.contents ?? '',
    type: summary?.type ?? '',
    participants: summary?.participants.map(user => user.id) ?? [],
    reporter: summary?.reporter.id ?? '',
    date: new Date(summary?.date) ?? new Date(),
  }
  return {
    defaultValues,
    onSubmit: handleSubmit,
  }
}
