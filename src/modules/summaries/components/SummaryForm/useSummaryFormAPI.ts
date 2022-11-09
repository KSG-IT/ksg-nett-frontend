import { SummaryNode, SummaryType } from '../../types'
import { SummaryCleanedData } from './useSummaryLogic'
import { usePatchSummaryMutations } from '../../mutations'
import { ALL_SUMMARIES, SUMMARY_QUERY } from '../../queries'
import { useNavigate } from 'react-router-dom'

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

  const defaultValues = {
    contents: summary?.contents ?? '',
    type: summary?.type ?? SummaryType.ARRANGEMENT,
    participants: summary?.participants.map(user => user.id) ?? [],
    reporter: summary?.reporter.id ?? '',
    //date: new Date(summary?.date ?? `${new Date()}`) ?? new Date(),
    date: (summary?.date && new Date(summary.date)) ?? new Date(),
  }
  return {
    defaultValues,
    onSubmit: handleSubmit,
  }
}
