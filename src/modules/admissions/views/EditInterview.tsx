import { useQuery } from '@apollo/client'
import { Button, Group, Modal, Stack, Text, Title } from '@mantine/core'
import { FullPage404, FullPageError } from 'components/FullPageComponents'
import { FullContentLoader } from 'components/Loading'
import { MessageBox } from 'components/MessageBox'
import { useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import {
  AdditionalEvaluationAnswerList,
  AdditionalInformationFields,
  ApplicantPrioritiesField,
  BooleanEvaluationAnswerList,
  InterviewNoteBox,
  TotalEvaluationSelect,
} from '../components/EditInterview/'
import { ApplicantStatusValues } from '../consts'
import { usePatchApplicant } from '../mutations.hooks'
import { INTERVIEW_DETAIL_QUERY } from '../queries'
import {
  InterviewDetailQueryReturns,
  InterviewDetailQueryVariables,
} from '../types.graphql'

interface EditInterviewParams {
  interviewId: string
}

export const EditInterview: React.VFC = () => {
  const { interviewId } = useParams<EditInterviewParams>()
  const [modalOpen, setModalOpen] = useState(false)
  const history = useHistory()

  const { data, loading, error } = useQuery<
    InterviewDetailQueryReturns,
    InterviewDetailQueryVariables
  >(INTERVIEW_DETAIL_QUERY, {
    variables: { id: interviewId },
  })

  const { patchApplicant } = usePatchApplicant()

  if (error) return <FullPageError />

  if (loading || !data) return <FullContentLoader />

  const { interview } = data

  if (interview === null) return <FullPage404 />

  const handleLockInterview = () => {
    patchApplicant({
      variables: {
        id: interview.applicant.id,
        input: {
          status: ApplicantStatusValues.INTERVIEW_FINISHED,
        },
      },
    }).then(() =>
      history.push(`/admissions/applicants/${interview.applicant.id}`)
    )
  }

  return (
    <Stack style={{ overflowY: 'scroll', width: '100%', padding: '32px' }}>
      <Title>Intervjunotater: {interview.applicant.fullName}</Title>
      <MessageBox type="danger">
        <b>Obs!</b> Det skal aldri være mer enn én person som fører notater. Det
        vil si at bare én skal være inne på denne siden mens intervjuet pågår.
        Dette er for å forsikre integritet i intervjunotatene. Det samme gjelder
        å ha flere faner oppe på samme side.
      </MessageBox>

      {/* We render different interview evaluation fields */}
      <BooleanEvaluationAnswerList interview={interview} />
      <AdditionalEvaluationAnswerList interview={interview} />
      <AdditionalInformationFields applicant={interview.applicant} />
      <ApplicantPrioritiesField applicant={interview.applicant} />

      {/* Interview and discussion Notes */}
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

      {/* Final evaluation */}
      <Group>
        <TotalEvaluationSelect interview={interview} />
      </Group>

      {/* Controls */}
      <Group>
        <Button>Lagre</Button>

        <Button
          onClick={() => {
            setModalOpen(true)
          }}
        >
          Lås intervjunotater
        </Button>
        <Button color="red">ToDo: Møtte aldri opp</Button>
      </Group>

      {/* Confirm interview lock prompt */}
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
