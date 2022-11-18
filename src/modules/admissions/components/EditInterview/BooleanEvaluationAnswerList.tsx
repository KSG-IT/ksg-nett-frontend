import { InterviewNode } from 'modules/admissions/types.graphql'
import { BooleanEvaluationInline } from './BooleanEvaluationInline'

interface BooleanEvaluationAnswerListProps {
  interview: InterviewNode
}

export const BooleanEvaluationAnswerList: React.VFC<
  BooleanEvaluationAnswerListProps
> = ({ interview }) => {
  const { booleanEvaluationAnswers } = interview
  return (
    <>
      {booleanEvaluationAnswers.map(booleanEvaluation => (
        <BooleanEvaluationInline
          key={booleanEvaluation.id}
          booleanEvaluationAnswer={booleanEvaluation}
        />
      ))}
    </>
  )
}
