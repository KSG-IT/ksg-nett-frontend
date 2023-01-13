import { useQuery } from '@apollo/client'
import {
  Button,
  Group,
  LoadingOverlay,
  Modal,
  ModalProps,
  Stack,
  Text,
  UnstyledButton,
} from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import {
  IconAlertTriangle,
  IconExclamationMark,
  IconHomeExclamation,
  IconMoodAngry,
  IconTrash,
} from '@tabler/icons'
import { FullPage404, FullPageError } from 'components/FullPageComponents'
import { MessageBox } from 'components/MessageBox'
import {
  useApplicantMutations,
  useInterviewMutations,
} from 'modules/admissions/mutations.hooks'
import {
  INTERVIEW_SHALLOW_DETAILS_QUERY,
  INTERVIEW_TABLE_OVERVIEW_QUERY,
} from 'modules/admissions/queries'
import { InterviewDetailQueryReturns } from 'modules/admissions/types.graphql'
import { useMemo, useState } from 'react'
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

  const {
    deleteInterview,
    removeApplicantFromInterview,
    removeApplicantFromInterviewLoading,
  } = useInterviewMutations()

  function handleAssignNewInterview() {
    if (!applicantId || !interview) return

    assignApplicantNewInterview({
      variables: {
        applicantId,
        interviewId: interview.id,
      },
      refetchQueries: [
        INTERVIEW_TABLE_OVERVIEW_QUERY,
        INTERVIEW_SHALLOW_DETAILS_QUERY,
      ],
      onCompleted() {
        showNotification({
          title: 'Intervju tilbudt',
          message:
            'Intervjuet er tilbudt til søkeren. Søker mottar bekreftelse på epost',
          color: 'green',
        })
        setApplicantId(null)
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

  function handleDeleteInterview() {
    if (!interview) return

    const confirmed = confirm('Er du sikker på at du vil slette intervjuet?')
    if (!confirmed) return

    deleteInterview({
      variables: {
        id: interview.id,
      },
      refetchQueries: [INTERVIEW_TABLE_OVERVIEW_QUERY],
      onCompleted() {
        showNotification({
          title: 'Intervju slettet',
          message: 'Intervjuet er slettet',
          color: 'green',
        })
        props.onClose()
      },
      onError({ message }) {
        showNotification({
          title: 'Noe gikk galt',
          color: 'red',
          message,
        })
      },
    })
  }

  function handleRemoveApplicantFromInterview() {
    if (!interview) return
    const confirmed = confirm(
      'Er du sikker på at du vil fjerne søkeren fra intervjuet?'
    )
    if (!confirmed) return

    removeApplicantFromInterview({
      variables: {
        interviewId: interview.id,
      },
      refetchQueries: [
        INTERVIEW_SHALLOW_DETAILS_QUERY,
        INTERVIEW_TABLE_OVERVIEW_QUERY,
      ],
      onCompleted() {
        showNotification({
          title: 'Søker fjernet',
          message: 'Søkeren er fjernet fra intervjuet',
          color: 'green',
        })
      },
      onError({ message }) {
        showNotification({
          title: 'Noe gikk galt',
          color: 'red',
          message,
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

  const free = interview.applicant === null

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
          <Group position="apart">
            <Text size="lg" weight={500}>
              Intervjudetaljer
            </Text>

            <UnstyledButton onClick={handleDeleteInterview}>
              <IconTrash />
            </UnstyledButton>
          </Group>
          <Text>Lokale: {interview.location.name}</Text>
          <Text>
            Starttidspunkt:{' '}
            {format(new Date(interview.interviewStart), 'eee dd MMM HH:mm')}
          </Text>
        </Stack>

        {free && <ApplicantSelect onApplicantSelect={setApplicantId} />}
        {!free && (
          <>
            <MessageBox type="warning">
              Intervjuet er booket av {interview.applicant?.fullName}
            </MessageBox>
            <Button
              leftIcon={<IconAlertTriangle />}
              color="red"
              loading={removeApplicantFromInterviewLoading}
              onClick={handleRemoveApplicantFromInterview}
            >
              Fjern fra intervju
            </Button>
          </>
        )}
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
