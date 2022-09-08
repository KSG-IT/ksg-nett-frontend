import { Card } from '@mantine/core'
import { ApplicantCommentNode } from 'modules/admissions/types.graphql'
import { ApplicantCommentCard } from './ApplicantCommentCard'

interface ApplicantCommentList {
  comments: ApplicantCommentNode[]
}

export const ApplicantCommentList: React.VFC<ApplicantCommentList> = ({
  comments,
}) => {
  if (comments.length === 0) {
    return <Card>Ingen kommentarer</Card>
  }
  return (
    <>
      {comments.map(comment => (
        <ApplicantCommentCard comment={comment} key={comment.id} />
      ))}
    </>
  )
}
