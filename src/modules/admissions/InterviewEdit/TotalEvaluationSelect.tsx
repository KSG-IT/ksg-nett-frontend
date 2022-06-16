import { Select } from '@mantine/core'
import { usePatchInterview } from '../mutations.hooks'
import { InterviewNode } from '../types'

const totalEvaluationOptions = [
  {
    value: 'VERY_POOR',
    label: 'Veldig dårlig',
  },
  {
    value: 'POOR',
    label: 'Dårlig',
  },
  {
    value: 'MEDIUM',
    label: 'Middels',
  },
  {
    value: 'GOOD',
    label: 'Bra',
  },
  {
    value: 'VERY_GOOD',
    label: 'Veldig bra',
  },
]

interface TotalEvaluationSelectProps {
  interview: Pick<InterviewNode, 'totalEvaluation' | 'id'>
}

export const TotalEvaluationSelect: React.VFC<TotalEvaluationSelectProps> = ({
  interview,
}) => {
  const { patchInterview } = usePatchInterview()

  const handleChange = (
    value: 'VERY_POOR' | 'POOR' | 'MEDIUM' | 'GOOD' | 'VERY_GOOD'
  ) => {
    patchInterview({
      variables: {
        id: interview.id,
        input: {
          totalEvaluation: value,
        },
      },
    })
  }

  return (
    <Select
      label="Totalvurdering"
      placeholder="Velg verdi"
      data={totalEvaluationOptions}
      onChange={handleChange}
    />
  )
}
