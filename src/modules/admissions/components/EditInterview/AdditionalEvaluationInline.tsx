import { useMutation } from '@apollo/client'
import { Group, Select } from '@mantine/core'
import { InterviewAdditionalEvaluationAnswerValues } from 'modules/admissions/consts'
import { PATCH_INTERVIEW_ADDITIONAL_EVALUATION_ANSWER } from 'modules/admissions/mutations'
import { additionalEvaluationOptions } from 'modules/admissions/options'
import {
  InterviewAdditionalEvaluationAnswerNode,
  PatchInterviewAdditionalEvaluationAnswerReturns,
  PatchInterviewAdditionalEvaluationAnswerVariables,
} from 'modules/admissions/types.graphql'
import React, { useState } from 'react'

interface AdditionalEvaluationInlineProps {
  additionalEvaluation: InterviewAdditionalEvaluationAnswerNode
}
export const AdditionalEvaluationInline: React.VFC<
  AdditionalEvaluationInlineProps
> = ({ additionalEvaluation }) => {
  const [selectedValue, setSelectedValue] = useState<
    InterviewAdditionalEvaluationAnswerValues | ''
  >(additionalEvaluation.answer ?? '')

  const [patchAnswer] = useMutation<
    PatchInterviewAdditionalEvaluationAnswerReturns,
    PatchInterviewAdditionalEvaluationAnswerVariables
  >(PATCH_INTERVIEW_ADDITIONAL_EVALUATION_ANSWER)

  const handleChange = (selected: string | null) => {
    if (selected === additionalEvaluation.answer) return

    const parsedValue =
      selected === '' || selected === null
        ? null
        : (selected as InterviewAdditionalEvaluationAnswerValues)

    patchAnswer({
      variables: {
        id: additionalEvaluation.id,
        input: {
          answer: parsedValue,
        },
      },
    })
    setSelectedValue(
      (selected ?? '') as InterviewAdditionalEvaluationAnswerValues | ''
    )
  }

  return (
    <Group>
      <Select
        label={additionalEvaluation.statement.statement}
        onChange={val =>
          handleChange(
            (val ?? '') as InterviewAdditionalEvaluationAnswerValues | ''
          )
        }
        value={selectedValue}
        data={additionalEvaluationOptions}
      />
    </Group>
  )
}
