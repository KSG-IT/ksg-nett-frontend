import { Button, Textarea, Title } from '@mantine/core'
import { MessageBox } from 'components/MessageBox'
import { useApplicantCommentMutations } from 'modules/admissions/mutations.hooks'
import { ApplicantNode } from 'modules/admissions/types.graphql'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { ApplicantCommentList } from './ApplicantCommentList'

interface ApplicantCommentsProps {
  applicant: Pick<ApplicantNode, 'id' | 'comments'>
}

export const ApplicantComments: React.VFC<ApplicantCommentsProps> = ({
  applicant,
}) => {
  const [comment, setComment] = useState('')
  const { comments } = applicant

  const { createApplicantComment } = useApplicantCommentMutations()

  function handleCreateComment() {
    createApplicantComment({
      variables: { input: { applicant: applicant.id, text: comment } },
      refetchQueries: [],
    }).then(() => {
      toast.success('Kommentar lagret')
      setComment('')
    })
  }

  return (
    <>
      <Title order={2}>Kommentarer</Title>
      <MessageBox type="info">
        Her har du mulighet til å skrive en kommentar på søkeren. Det er mulig å
        legge igjen en kommentar både før og etter intevjuet.
      </MessageBox>
      <ApplicantCommentList comments={comments} />
      <Title order={3}>Skriv en kommentar</Title>

      <Textarea
        my="md"
        value={comment}
        minRows={4}
        onChange={evt => setComment(evt.target.value)}
      />
      <Button onClick={handleCreateComment} disabled={comment === ''}>
        Lagre kommentar
      </Button>
    </>
  )
}
