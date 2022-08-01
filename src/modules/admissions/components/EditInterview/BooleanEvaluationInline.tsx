import { useMutation } from '@apollo/client'
import { Group, Radio, RadioGroup } from '@mantine/core'
import { PATCH_INTERVIEW_BOOLEAN_EVALUATION_ANSWER } from 'modules/admissions/mutations'
import {
  InterviewBooleanEvaluationAnswerNode,
  PatchInterviewBooleanEvaluationAnswerReturns,
} from 'modules/admissions/types.graphql'
import React, { useState } from 'react'
import { PatchMutationVariables } from 'types/graphql'
import { booleanToRadio, radioToBoolean } from 'util/parsing'

interface BooleanEvaluationInlineProps {
  booleanEvaluationAnswer: InterviewBooleanEvaluationAnswerNode
}

export const BooleanEvaluationInline: React.VFC<
  BooleanEvaluationInlineProps
> = ({ booleanEvaluationAnswer }) => {
  const [value, setValue] = useState(
    booleanToRadio(booleanEvaluationAnswer.value)
  )

  const [patchBooleanEvaluationAnswer] = useMutation<
    PatchInterviewBooleanEvaluationAnswerReturns,
    PatchMutationVariables<InterviewBooleanEvaluationAnswerNode>
  >(PATCH_INTERVIEW_BOOLEAN_EVALUATION_ANSWER)

  const handleChange = (val: 'yes' | 'no') => {
    setValue(val)
    const parsedValue = radioToBoolean(val)

    patchBooleanEvaluationAnswer({
      variables: {
        id: booleanEvaluationAnswer.id,
        input: { value: parsedValue },
      },
    })
  }

  return (
    <Group>
      <RadioGroup
        value={value}
        onChange={handleChange}
        label={booleanEvaluationAnswer.statement.statement}
      >
        <Radio value="yes" label="Ja" />
        <Radio value="no" label="Nei" />
      </RadioGroup>
    </Group>
  )
}
