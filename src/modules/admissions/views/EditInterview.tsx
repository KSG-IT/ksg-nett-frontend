import { useQuery } from '@apollo/client'
import { Button, Group, Stack, Title } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import Link from '@tiptap/extension-link'
import { useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { FullPage404, FullPageError } from 'components/FullPageComponents'
import { FullContentLoader } from 'components/Loading'
import { MessageBox } from 'components/MessageBox'
import { RichTextEditor } from 'components/RichTextEditor'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  AdditionalEvaluationAnswerList,
  AdditionalInformationFields,
  ApplicantDidNotShowModal,
  ApplicantPrioritiesField,
  BooleanEvaluationAnswerList,
  LockInterviewModal,
  TotalEvaluationSelect,
} from '../components/EditInterview/'
import { ApplicantStatusValues } from '../consts'
import { useInterviewMutations, usePatchApplicant } from '../mutations.hooks'
import { INTERVIEW_DETAIL_QUERY } from '../queries'
import {
  InterviewDetailQueryReturns,
  InterviewDetailQueryVariables,
} from '../types.graphql'

interface EditInterviewParams {
  interviewId: string
}

export const EditInterview: React.FC = () => {
  const { interviewId } = useParams<
    keyof EditInterviewParams
  >() as EditInterviewParams
  const [lockModalOpen, setLockModalOpen] = useState(false)
  const [didNotShowModalOpen, setDidNotShowModalOpen] = useState(false)

  const { patchInterview } = useInterviewMutations()

  const notesEditor = useEditor({
    extensions: [StarterKit, Link],
    content: '',
  })
  const discussionEditor = useEditor({
    extensions: [StarterKit, Link],
    content: '',
  })

  const navigate = useNavigate()

  const { data, loading, error } = useQuery<
    InterviewDetailQueryReturns,
    InterviewDetailQueryVariables
  >(INTERVIEW_DETAIL_QUERY, {
    variables: { id: interviewId },
    onCompleted({ interview }) {
      if (!interview) return
      if (notesEditor) {
        notesEditor.commands.setContent(interview.notes)
      }

      if (discussionEditor) {
        discussionEditor.commands.setContent(interview.discussion)
      }
    },
  })

  const { patchApplicant } = usePatchApplicant()

  if (error) return <FullPageError />

  if (loading || !data) return <FullContentLoader />

  const { interview } = data

  if (interview === null) return <FullPage404 />

  if (interview.applicant.status === ApplicantStatusValues.INTERVIEW_FINISHED) {
    return <span>Intervjuet er stengt for notater</span>
  }

  function handleLockInterview() {
    if (!discussionEditor || !notesEditor) {
      showNotification({
        title: 'Noe gikk galt',
        message: 'Kunne ikke låse intervjuet',
        color: 'red',
      })
      return
    }
    patchInterview({
      variables: {
        id: interviewId,
        input: {
          discussion: discussionEditor.getHTML(),
          notes: notesEditor.getHTML(),
        },
      },
      onCompleted() {
        // Too nested
        patchApplicant({
          variables: {
            id: interview!.applicant.id,
            input: {
              status: ApplicantStatusValues.INTERVIEW_FINISHED,
            },
          },
          onCompleted() {
            showNotification({
              title: 'Sukkess',
              message: 'Intervjunotater er låst',
              color: 'teal',
            })
            navigate(`/admissions/applicants/${interview!.applicant.id}`)
          },
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

  function handleApplicantDidNotShow() {
    patchApplicant({
      variables: {
        id: interview!.applicant.id,
        input: {
          status: ApplicantStatusValues.DID_NOT_SHOW_UP_FOR_INTERVIEW,
        },
      },
      onCompleted() {
        navigate(`/admissions/applicants/${interview!.applicant.id}`)
      },
      onError({ message }) {
        showNotification({
          title: 'Noe gikk galt',
          message,
        })
      },
    })
  }

  function handleSaveNotes() {
    if (!notesEditor || !discussionEditor) {
      showNotification({
        title: 'Noe gikk galt',
        message: 'Kunne ikke lagre intervjunotater',
        color: 'red',
      })
      return
    }

    patchInterview({
      variables: {
        id: interview!.id,
        input: {
          notes: notesEditor.getHTML(),
          discussion: discussionEditor.getHTML(),
        },
      },
      onCompleted() {
        showNotification({
          title: 'Sukkess',
          message: 'Intervjunotater er lagret',
          color: 'teal',
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
    <Stack>
      <Title>Intervjunotater: {interview.applicant.fullName}</Title>
      <MessageBox type="danger">
        <b>Obs!</b> Det skal aldri være mer enn én person som fører notater. Det
        vil si at bare én skal være inne på denne siden mens intervjuet pågår.
        Dette er for å forsikre integritet i intervjunotatene.
      </MessageBox>

      {/* We render different interview evaluation fields */}
      <BooleanEvaluationAnswerList interview={interview} />
      <AdditionalEvaluationAnswerList interview={interview} />
      <AdditionalInformationFields applicant={interview.applicant} />
      <ApplicantPrioritiesField applicant={interview.applicant} />

      {/* Interview and discussion Notes */}
      <Title order={2}>Intervjunotater</Title>

      <RichTextEditor editor={notesEditor} />
      <Title order={2}>Diskusjonsnotater</Title>
      <RichTextEditor editor={discussionEditor} />

      {/* Final evaluation */}
      <Group>
        <TotalEvaluationSelect interview={interview} />
      </Group>

      {/* Controls */}
      <Group>
        <Button onClick={handleSaveNotes}>Lagre</Button>
        <Button
          onClick={() => {
            setLockModalOpen(true)
          }}
        >
          Lås intervjunotater
        </Button>
        <Button
          onClick={() => {
            setDidNotShowModalOpen(true)
          }}
          color="red"
        >
          Møtte aldri opp
        </Button>
      </Group>

      <LockInterviewModal
        opened={lockModalOpen}
        onClose={() => setLockModalOpen(false)}
        lockInterviewCallback={handleLockInterview}
      />
      <ApplicantDidNotShowModal
        opened={didNotShowModalOpen}
        onClose={() => setDidNotShowModalOpen(false)}
        applicantDidNotShowCallback={handleApplicantDidNotShow}
      />
    </Stack>
  )
}
