import { Button, Group, Modal, Text, Textarea } from '@mantine/core'
import { useApplicantMutations } from 'modules/admissions/mutations.hooks'
import { ApplicantNode } from 'modules/admissions/types.graphql'
import { useState } from 'react'

interface ApplicantNoticeCommentInputProps {
  applicant: Pick<ApplicantNode, 'id' | 'noticeComment'>
}

export const ApplicantNoticeCommentInput: React.VFC<
  ApplicantNoticeCommentInputProps
> = ({ applicant }) => {
  const [modalOpen, setModalOpen] = useState(false)
  const [comment, setComment] = useState(applicant.noticeComment)
  const [modalComment, setModalComment] = useState(applicant.noticeComment)

  const isEmpty = comment === ''

  const { patchApplicant } = useApplicantMutations()

  async function handleCommitChange() {
    await patchApplicant({
      variables: { id: applicant.id, input: { noticeComment: modalComment } },
    }).then(() => {
      setModalOpen(false)
      setComment(modalComment)
    })
  }

  function handleCancel() {
    setModalOpen(false)
    setModalComment(comment)
  }

  return (
    <>
      <Text onClick={() => setModalOpen(true)} style={{ cursor: 'pointer' }}>
        {isEmpty ? 'Skriv kommentar' : comment}
      </Text>
      <Modal opened={modalOpen} onClose={() => setModalOpen(false)}>
        <Textarea
          value={modalComment}
          placeholder={'Srkiv kommentar'}
          onChange={evt => setModalComment(evt.target.value)}
        />
        <Group align={'flex-end'}>
          <Button onClick={handleCancel} color="red">
            Avbryt
          </Button>
          <Button onClick={handleCommitChange}>Lagre kommentar</Button>
        </Group>
      </Modal>
    </>
  )
}
