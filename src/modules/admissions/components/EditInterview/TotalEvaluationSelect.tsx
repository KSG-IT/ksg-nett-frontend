import { Select } from '@mantine/core'
import { InterviewTotalEvaluationValues } from 'modules/admissions/consts'
import { useInterviewMutations } from 'modules/admissions/mutations.hooks'
import { InterviewNode } from 'modules/admissions/types.graphql'
import { useState } from 'react'

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
  const [selectedValue, setSelectedValue] = useState(interview.totalEvaluation)
  const { patchInterview } = useInterviewMutations()

  const handleChange = (value: InterviewTotalEvaluationValues) => {
    setSelectedValue(value)
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
      value={selectedValue}
      data={totalEvaluationOptions}
      onChange={handleChange}
    />
  )
}
