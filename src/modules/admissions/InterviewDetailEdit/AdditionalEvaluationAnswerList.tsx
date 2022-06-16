import { InterviewAdditionalEvaluationAnswerNode } from '../types'
import { AdditionalEvaluationInline } from './AdditionalEvaluationInline'

interface AdditionalEvaluationListProps {
  additionalEvaluations: InterviewAdditionalEvaluationAnswerNode[]
}

export const AdditionalEvaluationAnswerList: React.VFC<
  AdditionalEvaluationListProps
> = ({ additionalEvaluations }) => {
  return (
    <>
      {additionalEvaluations.map(additionalEvaluation => (
        <AdditionalEvaluationInline
          key={additionalEvaluation.id}
          additionalEvaluation={additionalEvaluation}
        />
      ))}
    </>
  )
}
