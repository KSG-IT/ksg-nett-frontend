import { useNavigate } from 'react-router-dom'
import { usePatchSummaryMutations } from '../../mutations'
import { ALL_SUMMARIES, SUMMARY_QUERY } from '../../queries'
import { SummaryNode } from '../../types'
import { SummaryCleanedData } from './useSummaryLogic'

export function useSummaryFormAPI(summary?: SummaryNode) {
  const { patchSummary, createSummary } = usePatchSummaryMutations()
  const navigate = useNavigate()

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
        onCompleted: data => {
          navigate(`/summaries/${data.patchSummary.summary.id}`)
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
          navigate(`/summaries/${data.createSummary.summary.id}`)
        },
      })
    }
  }

  // let initialInternalGroupValue = summary?.internalGroup?.id ?? ''

  // if (initialInternalGroupValue === '' && summary?.title !== '') {
  //   initialInternalGroupValue = 'other'
  // }

  const defaultValues = {
    contents: summary?.contents ?? '',
    internalGroup: summary?.internalGroup?.id ?? 'other',
    title: summary?.title ?? '',
    participants: summary?.participants.map(user => user.id) ?? [],
    reporter: summary?.reporter.id ?? '',
    date: (summary?.date && new Date(summary.date)) ?? new Date(),
  }
  return {
    defaultValues,
    onSubmit: handleSubmit,
  }
}
