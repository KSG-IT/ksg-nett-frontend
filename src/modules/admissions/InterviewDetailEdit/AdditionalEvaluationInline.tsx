import { useMutation } from '@apollo/client'
import { Group, Select } from '@mantine/core'
import { additionalEvaluationOptions } from 'modules/admissions/consts'
import { PATCH_INTERVIEW_ADDITIONAL_EVALUATION_ANSWER } from 'modules/admissions/mutations'
import React, { useState } from 'react'
import {
  InterviewAdditionalEvaluationAnswerNode,
  PatchInterviewAdditionalEvaluationAnswerReturns,
  PatchInterviewAdditionalEvaluationAnswerVariables,
} from '../types'

type AdditionalEvaluationOptionValue =
  | 'VERY_LITTLE'
  | 'LITTLE'
  | 'MEDIUM'
  | 'SOMEWHAT'
  | 'VERY'
  | ''

interface AdditionalEvaluationInlineProps {
  additionalEvaluation: InterviewAdditionalEvaluationAnswerNode
}
export const AdditionalEvaluationInline: React.VFC<
  AdditionalEvaluationInlineProps
> = ({ additionalEvaluation }) => {
  const [selectedValue, setSelectedValue] =
    useState<AdditionalEvaluationOptionValue>(additionalEvaluation.answer || '')
  const [patchAnswer] = useMutation<
    PatchInterviewAdditionalEvaluationAnswerReturns,
    PatchInterviewAdditionalEvaluationAnswerVariables
  >(PATCH_INTERVIEW_ADDITIONAL_EVALUATION_ANSWER)

  const handleChange = (selected: AdditionalEvaluationOptionValue) => {
    if (selected === additionalEvaluation.answer) return

    const parsedValue = selected === '' ? null : selected

    patchAnswer({
      variables: {
        id: additionalEvaluation.id,
        input: {
          answer: parsedValue,
        },
      },
    })
    setSelectedValue(selected)
  }

  return (
    <Group>
      <Select
        label={additionalEvaluation.statement.statement}
        onChange={handleChange}
        value={selectedValue}
        data={additionalEvaluationOptions}
      />
    </Group>
  )
}
