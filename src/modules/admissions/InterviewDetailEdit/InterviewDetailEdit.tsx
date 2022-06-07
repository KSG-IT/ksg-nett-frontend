import { useQuery } from '@apollo/client'
import { Button, Group, Modal, Stack, Text, Title } from '@mantine/core'
import { FullPage404, FullPageError } from 'components/FullPageComponents'
import { FullContentLoader } from 'components/Loading'
import { useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { usePatchApplicant } from '../mutations.hooks'
import { INTERVIEW_DETAIL_QUERY } from '../queries'
import { ApplicantNode } from '../types'
import {
  AdditionalEvaluationInline,
  InterviewAdditionalEvaluationAnswerNode,
} from './AdditionalEvaluationInline'
import { AdditionalInformationFields } from './AdditionalInformationFields'
import { BooleanEvaluationInline } from './BooleanEvaluationInline'
import { InterviewNoteBox } from './InterviewNoteBox'

interface InterviewDetailEditParams {
  interviewId: string
}

type InterviewBooleanEvaluationAnswerNode = {
  id: string
  value: boolean | null
  statement: {
    statement: string
  }
}

type InterviewNode = {
  id: string
  notes: string
  discussion: string
  applicant: Pick<
    ApplicantNode,
    'id' | 'fullName' | 'canCommitThreeSemesters' | 'openForOtherPositions'
  >
  booleanEvaluationAnswers: InterviewBooleanEvaluationAnswerNode[]
  additionalEvaluationAnswers: InterviewAdditionalEvaluationAnswerNode[]
}

export const InterviewDetailEdit: React.VFC = () => {
  const { interviewId } = useParams<InterviewDetailEditParams>()
  const [modalOpen, setModalOpen] = useState(false)
  const history = useHistory()
  const [notes, setNotes] = useState()

  const { data, loading, error } = useQuery(INTERVIEW_DETAIL_QUERY, {
    variables: { id: interviewId },
  })

  const { patchApplicant } = usePatchApplicant()

  if (error) return <FullPageError />

  if (loading || !data) return <FullContentLoader />

  const interview: InterviewNode = data.interview

  if (interview === null) return <FullPage404 />
  console.log(interview)

  const handleLockInterview = () => {
    patchApplicant({
      variables: {
        id: interview.applicant.id,
        input: {
          status: 'INTERVIEW_FINISHED',
        },
      },
    }).then(() => history.push(`/applicants/${interview.applicant.id}`))
  }
  return (
    <Stack style={{ overflowY: 'scroll', width: '100%', padding: '32px' }}>
      <Title>Intervjunotater: {interview.applicant.fullName}</Title>
      <Title>Ja/nei evalueringer </Title>
      <Stack>
        {interview.booleanEvaluationAnswers.map((booleanEvaluation, index) => (
          <BooleanEvaluationInline
            key={index}
            booleanEvaluationAnswer={booleanEvaluation}
          />
        ))}
      </Stack>

      <Title>Vurderinger</Title>
      <Stack>
        {interview.additionalEvaluationAnswers.map(
          (
            additionalEvaluation: InterviewAdditionalEvaluationAnswerNode,
            index
          ) => (
            <AdditionalEvaluationInline
              key={index}
              additionalEvaluation={additionalEvaluation}
            />
          )
        )}
      </Stack>
      <AdditionalInformationFields applicant={interview.applicant} />
      <InterviewNoteBox
        interviewId={interview.id}
        field="notes"
        initialValue={interview.notes}
      />

      <InterviewNoteBox
        interviewId={interview.id}
        field="discussion"
        initialValue={interview.discussion}
      />

      <Group>
        <Button>Lagre</Button>

        <Button
          onClick={() => {
            setModalOpen(true)
          }}
        >
          Lås intervjunotater
        </Button>
      </Group>

      <Modal
        opened={modalOpen}
        onClose={() => setModalOpen(false)}
        title={<Title>Lås intervju</Title>}
      >
        <Text>
          Er du sikker på at du har notert ferdig? Det er ikke mulig å redigere
          intervjuet etter denne handlingen!
        </Text>
        <Group position="right">
          <Button onClick={handleLockInterview}>Lås</Button>
          <Button onClick={() => setModalOpen(false)} color="red">
            Avbryt
          </Button>
        </Group>
      </Modal>
    </Stack>
  )
}
