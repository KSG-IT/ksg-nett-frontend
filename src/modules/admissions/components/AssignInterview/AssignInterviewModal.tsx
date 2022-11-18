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
import { MessageBox } from 'components/MessageBox'
import { useApplicantMutations } from 'modules/admissions/mutations.hooks'
import { ALL_AVAILABLE_INTERVIEWS_QUERY } from 'modules/admissions/queries'
import { InterviewNode } from 'modules/admissions/types.graphql'
import { useState } from 'react'
import { format } from 'util/date-fns'
import { ApplicantSelect } from '../ApplicantSelect'

interface AssignInterviewModalProps extends ModalProps {
  interview: Pick<
    InterviewNode,
    'id' | 'location' | 'interviewStart' | 'interviewEnd'
  > | null
}

export const AssignInterviewModal: React.FC<AssignInterviewModalProps> = ({
  interview,
  ...props
}) => {
  const [applicantId, setApplicantId] = useState<string | null>(null)

  const { assignApplicantNewInterview, assignApplicantNewInterviewLoading } =
    useApplicantMutations()

  function handleAssignNewInterview() {
    if (!applicantId || !interview) return

    assignApplicantNewInterview({
      variables: {
        applicantId,
        interviewId: interview.id,
      },
      refetchQueries: [ALL_AVAILABLE_INTERVIEWS_QUERY],
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

  function handleClose() {
    setApplicantId(null)
    props.onClose()
  }

  return (
    <Modal title="Tilby ny intervjutid" {...props}>
      <Stack>
        <MessageBox type="info">
          Søkere som ikke har svart på epost eller satt prioriteringer dukker
          ikke opp her.
        </MessageBox>
        {interview && (
          <Stack spacing="xs">
            <Text size="lg" weight={500}>
              Intervjudetaljer
            </Text>
            <Text>{interview.location.name}</Text>
            <Text>
              {format(new Date(interview.interviewStart), 'EEEE d. MMMM')}{' '}
              {format(new Date(interview.interviewStart), 'HH:mm')} -{' '}
              {format(new Date(interview.interviewEnd), 'HH:mm')}
            </Text>
          </Stack>
        )}
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
    </Modal>
  )
}
