import { InterviewNode } from 'modules/admissions/types.graphql'
import { AdditionalEvaluationInline } from './AdditionalEvaluationInline'

interface AdditionalEvaluationListProps {
  interview: InterviewNode
}

export const AdditionalEvaluationAnswerList: React.VFC<
  AdditionalEvaluationListProps
> = ({ interview }) => {
  const { additionalEvaluationAnswers } = interview
  return (
    <>
      {additionalEvaluationAnswers.map(additionalEvaluation => (
        <AdditionalEvaluationInline
          key={additionalEvaluation.id}
          additionalEvaluation={additionalEvaluation}
        />
      ))}
    </>
  )
}
