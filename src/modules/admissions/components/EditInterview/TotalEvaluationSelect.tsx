import { Select } from '@mantine/core'
import { InterviewTotalEvaluationValues } from 'modules/admissions/consts'
import { useInterviewMutations } from 'modules/admissions/mutations.hooks'
import { INTERVIEW_DETAIL_QUERY } from 'modules/admissions/queries'
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

  const handleChange = (value: string | null) => {
    if (!value) return
    setSelectedValue(value as InterviewTotalEvaluationValues)
    patchInterview({
      variables: {
        id: interview.id,
        input: {
          totalEvaluation: value as InterviewTotalEvaluationValues,
        },
      },
      refetchQueries: [INTERVIEW_DETAIL_QUERY],
    })
  }

  return (
    <Select
      label="Totalvurdering"
      description="Totalvurdering må være satt før intervjuet kan låses"
      placeholder="Velg verdi"
      value={selectedValue}
      data={totalEvaluationOptions}
      onChange={handleChange}
    />
  )
}
