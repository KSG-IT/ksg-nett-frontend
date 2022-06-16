import { InterviewBooleanEvaluationAnswerNode } from '../types'
import { BooleanEvaluationInline } from './BooleanEvaluationInline'

interface BooleanEvaluationAnswerListProps {
  booleanEvaluations: InterviewBooleanEvaluationAnswerNode[]
}

export const BooleanEvaluationAnswerList: React.VFC<
  BooleanEvaluationAnswerListProps
> = ({ booleanEvaluations }) => {
  return (
    <>
      {booleanEvaluations.map(booleanEvaluation => (
        <BooleanEvaluationInline
          key={booleanEvaluation.id}
          booleanEvaluationAnswer={booleanEvaluation}
        />
      ))}
    </>
  )
}
