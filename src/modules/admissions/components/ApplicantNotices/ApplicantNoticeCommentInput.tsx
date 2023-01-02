import { Button, Group, Modal, Stack, Text, Textarea } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { useApplicantMutations } from 'modules/admissions/mutations.hooks'
import { ApplicantNode } from 'modules/admissions/types.graphql'
import { useMemo, useState } from 'react'

interface ApplicantNoticeCommentInputProps {
  applicant: Pick<ApplicantNode, 'id' | 'noticeComment'>
}

export const ApplicantNoticeCommentInput: React.FC<
  ApplicantNoticeCommentInputProps
> = ({ applicant }) => {
  const [modalOpen, setModalOpen] = useState(false)
  const [comment, setComment] = useState(applicant.noticeComment)
  const [modalComment, setModalComment] = useState(applicant.noticeComment)

  const isEmpty = useMemo(() => comment === '', [comment])

  const { patchApplicant } = useApplicantMutations()

  async function handleCommitChange() {
    await patchApplicant({
      variables: { id: applicant.id, input: { noticeComment: modalComment } },
      onCompleted() {
        setModalOpen(false)
        setComment(modalComment)
      },
      onError({ message }) {
        showNotification({
          title: 'Noe gikk galt',
          message,
        })
      },
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
      <Modal
        title="Skriv kommentar"
        opened={modalOpen}
        onClose={() => setModalOpen(false)}
      >
        <Stack>
          <Textarea
            value={modalComment}
            placeholder={'Srkiv kommentar'}
            onChange={evt => setModalComment(evt.target.value)}
          />
          <Group align={'flex-end'}>
            <Button onClick={handleCancel} color="gray">
              Avbryt
            </Button>
            <Button onClick={handleCommitChange}>Lagre kommentar</Button>
          </Group>
        </Stack>
      </Modal>
    </>
  )
}
