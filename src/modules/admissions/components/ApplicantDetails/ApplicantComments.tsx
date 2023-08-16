import { Button, Textarea, Title } from '@mantine/core'
import { MessageBox } from 'components/MessageBox'
import { useApplicantCommentMutations } from 'modules/admissions/mutations.hooks'
import { APPLICANT_QUERY } from 'modules/admissions/queries'
import { ApplicantNode } from 'modules/admissions/types.graphql'
import { useState } from 'react'
import { ApplicantCommentList } from './ApplicantCommentList'
import { showNotification } from '@mantine/notifications'

interface ApplicantCommentsProps {
  applicant: Pick<ApplicantNode, 'id' | 'comments'>
}

export const ApplicantComments: React.FC<ApplicantCommentsProps> = ({
  applicant,
}) => {
  const [comment, setComment] = useState('')
  const { comments } = applicant

  const { createApplicantComment } = useApplicantCommentMutations()

  function handleCreateComment() {
    createApplicantComment({
      variables: { input: { applicant: applicant.id, text: comment } },
      refetchQueries: [APPLICANT_QUERY],
      onCompleted() {
        setComment('')
        showNotification({
          title: 'Suksess',
          message: 'Kommentar lagret',
          color: 'green',
        })
      },
      onError({ message }) {
        showNotification({
          title: 'Noe gikk galt',
          message,
          color: 'red',
        })
      },
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
        value={comment}
        minRows={4}
        onChange={evt => setComment(evt.target.value)}
      />
      <Button
        color="samfundet-red"
        onClick={handleCreateComment}
        disabled={comment === ''}
      >
        Lagre kommentar
      </Button>
    </>
  )
}
