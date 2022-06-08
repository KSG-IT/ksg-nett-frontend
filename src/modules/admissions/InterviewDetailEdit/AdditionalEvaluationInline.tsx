import { useMutation } from '@apollo/client'
import { Group, Text } from '@mantine/core'
import { additionalEvaluationOptions } from 'modules/admissions/consts'
import { PATCH_INTERVIEW_ADDITIONAL_EVALUATION_ANSWER } from 'modules/admissions/mutations'
import React, { useEffect, useState } from 'react'

type StatementNode = {
  id: string
  statement: string
}

export type InterviewAdditionalEvaluationAnswerNode = {
  id: string
  answer: string
  statement: StatementNode
}

interface AdditionalEvaluationInlineProps {
  additionalEvaluation: InterviewAdditionalEvaluationAnswerNode
}

type PatchInterviewAdditionalEvaluationInput = {
  answer: string
}

interface PatchInterviewAdditionalEvaluationVariables {
  id: string
  input: PatchInterviewAdditionalEvaluationInput
}

type Option = {
  value: string
  label: string
}

const stringOptionArraySearch = (str: string, arr: Option[]) => {
  // Searches for an option in an array of options by value.
  // Returns the option if found, otherwise undefined
  return arr.some(option => option.value === str)
}

export const AdditionalEvaluationInline: React.VFC<
  AdditionalEvaluationInlineProps
> = ({ additionalEvaluation }) => {
  const [selectedValue, setSelectedValue] = useState(
    stringOptionArraySearch(
      additionalEvaluation.answer,
      additionalEvaluationOptions
    )
      ? additionalEvaluation.answer
      : ''
  )
  const [patchAnswer] = useMutation(
    PATCH_INTERVIEW_ADDITIONAL_EVALUATION_ANSWER
  )

  useEffect(() => {
    if (selectedValue === additionalEvaluation.answer) return

    patchAnswer({
      variables: {
        id: additionalEvaluation.id,
        input: {
          answer: selectedValue,
        },
      },
    })
  }, [selectedValue, patchAnswer, additionalEvaluation.id])

  return (
    <Group>
      <Text>{additionalEvaluation.statement.statement}</Text>
      <select
        onChange={evt => {
          setSelectedValue(evt.target.value)
        }}
        value={selectedValue}
      >
        {additionalEvaluationOptions.map(option => (
          <option value={option.value}>{option.label}</option>
        ))}
      </select>
    </Group>
  )
}
