import { useMutation } from '@apollo/client'
import { Group, Radio } from '@mantine/core'
import { PATCH_INTERVIEW_BOOLEAN_EVALUATION_ANSWER } from 'modules/admissions/mutations'
import {
  InterviewBooleanEvaluationAnswerNode,
  PatchInterviewBooleanEvaluationAnswerReturns,
} from 'modules/admissions/types.graphql'
import React, { useState } from 'react'
import { PatchMutationVariables } from 'types/graphql'
import { booleanToRadio, radioToBoolean, yesNoHandler } from 'util/parsing'

interface BooleanEvaluationInlineProps {
  booleanEvaluationAnswer: InterviewBooleanEvaluationAnswerNode
}

export const BooleanEvaluationInline: React.FC<
  BooleanEvaluationInlineProps
> = ({ booleanEvaluationAnswer }) => {
  const [value, setValue] = useState(
    booleanToRadio(booleanEvaluationAnswer.value)
  )

  const [patchBooleanEvaluationAnswer] = useMutation<
    PatchInterviewBooleanEvaluationAnswerReturns,
    PatchMutationVariables<InterviewBooleanEvaluationAnswerNode>
  >(PATCH_INTERVIEW_BOOLEAN_EVALUATION_ANSWER)

  const handleChange = yesNoHandler(yesNo => {
    setValue(yesNo)
    patchBooleanEvaluationAnswer({
      variables: {
        id: booleanEvaluationAnswer.id,
        input: { value: radioToBoolean(yesNo) },
      },
    })
  })

  return (
    <Group>
      <Radio.Group
        value={value}
        onChange={handleChange}
        label={booleanEvaluationAnswer.statement.statement}
      >
        <Group>
          <Radio value="yes" label="Ja" />
          <Radio value="no" label="Nei" />
        </Group>
      </Radio.Group>
    </Group>
  )
}
