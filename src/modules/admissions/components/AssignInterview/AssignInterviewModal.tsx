import { useQuery } from '@apollo/client'
import {
  Button,
  Group,
  LoadingOverlay,
  Modal,
  ModalProps,
  Stack,
  Text,
} from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { FullPage404, FullPageError } from 'components/FullPageComponents'
import { MessageBox } from 'components/MessageBox'
import { useApplicantMutations } from 'modules/admissions/mutations.hooks'
import {
  INTERVIEW_SHALLOW_DETAILS_QUERY,
  INTERVIEW_TABLE_OVERVIEW_QUERY,
} from 'modules/admissions/queries'
import { InterviewDetailQueryReturns } from 'modules/admissions/types.graphql'
import { useState } from 'react'
import { format } from 'util/date-fns'
import { ApplicantSelect } from '../ApplicantSelect'

export interface AssignInterviewModalProps extends ModalProps {
  interviewId: string | null
  setInterviewIdCallback: (interviewId: string | null) => void
}

export const AssignInterviewModal: React.FC<AssignInterviewModalProps> = ({
  interviewId,
  setInterviewIdCallback,
  ...props
}) => {
  const [applicantId, setApplicantId] = useState<string | null>(null)

  // Change to shallow typing for returns
  const { data, loading, error } = useQuery<InterviewDetailQueryReturns>(
    INTERVIEW_SHALLOW_DETAILS_QUERY,
    {
      variables: {
        id: interviewId,
      },
    }
  )

  const { assignApplicantNewInterview, assignApplicantNewInterviewLoading } =
    useApplicantMutations()

  function handleAssignNewInterview() {
    if (!applicantId || !interview) return

    assignApplicantNewInterview({
      variables: {
        applicantId,
        interviewId: interview.id,
      },
      refetchQueries: [INTERVIEW_TABLE_OVERVIEW_QUERY],
      onCompleted() {
        showNotification({
          title: 'Intervju tilbudt',
          message:
            'Intervjuet er tilbudt til søkeren. Søker mottar bekreftelse på epost',
          color: 'green',
        })
        setApplicantId(null)
        props.onClose()
      },
      onError() {
        showNotification({
          title: 'Noe gikk galt',
          message:
            'Kan hende noen andre har booket samme intervju. Prøv et annet intervju annet',
          color: 'red',
        })
      },
    })
  }

  if (error) return <FullPageError />

  if (loading || !data)
    return (
      <Modal title="Tilby ny intervjutid" {...props}>
        <LoadingOverlay visible={true} />
      </Modal>
    )

  const { interview } = data

  if (!interview) return <FullPage404 />

  if (!interview) return <FullPage404 />

  function handleClose() {
    setApplicantId(null)
    setInterviewIdCallback(null)
    props.onClose()
  }

  return (
    <Modal title="Tilby ny intervjutid" {...props}>
      <Stack>
        <MessageBox type="info">
          Søkere som ikke har svart på epost eller satt prioriteringer dukker
          ikke opp her.
        </MessageBox>

        <Stack spacing="xs">
          <Text size="lg" weight={500}>
            Intervjudetaljer
          </Text>
          <Text>Lokale: {interview.location.name}</Text>
          <Text>
            Starttidspunkt:{' '}
            {format(new Date(interview.interviewStart), 'eee dd MMM HH:mm')}
          </Text>
        </Stack>

        <ApplicantSelect onApplicantSelect={setApplicantId} />

        <Group position="right">
          <Button color="gray" onClick={handleClose}>
            Avbryt
          </Button>
          <Button
            color="samfundet-red"
            disabled={applicantId === null}
            loading={assignApplicantNewInterviewLoading}
            onClick={handleAssignNewInterview}
          >
            Bekreft intervjutid
          </Button>
        </Group>
      </Stack>
      <LoadingOverlay
        visible={assignApplicantNewInterviewLoading || loading || !data}
      />
    </Modal>
  )
}
