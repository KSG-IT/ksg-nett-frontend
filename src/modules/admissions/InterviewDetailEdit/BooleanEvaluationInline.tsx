import { useMutation } from '@apollo/client'
import { Group, Radio, RadioGroup } from '@mantine/core'
import React, { useState } from 'react'
import { PatchMutationVariables } from 'types/graphql'
import { booleanToRadio, radioToBoolean } from 'util/parsing'
import { PATCH_INTERVIEW_BOOLEAN_EVALUATION_ANSWER } from '../mutations'
import { PatchInterviewBooleanEvaluationAnswerReturns } from '../types'

type InterviewBooleanEvaluationAnswerNode = {
  id: string
  value: boolean | null
  statement: {
    statement: string
  }
}

interface BooleanEvaluationInlineProps {
  booleanEvaluationAnswer: InterviewBooleanEvaluationAnswerNode
}

export const BooleanEvaluationInline: React.VFC<
  BooleanEvaluationInlineProps
> = ({ booleanEvaluationAnswer }) => {
  /**
   * This component serves to alter the response of yes/no type evalutation questions in
   * an inline format. Each change of the local state triggers a mutation to the backend.
   * If anything goes wrong we should probably reset the value and give some sort of toast
   * feedback
   */
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
