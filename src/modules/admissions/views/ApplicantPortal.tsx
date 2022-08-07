import { useQuery } from '@apollo/client'
import {
  Button,
  Center,
  Group,
  List,
  Stack,
  Stepper,
  Text,
  Title,
} from '@mantine/core'
import { FullPageError } from 'components/FullPageComponents'
import { FullContentLoader } from 'components/Loading'
import { format } from 'date-fns'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { InterviewBooking } from '../components/ApplicantPortal/InterviewBooking'
import { RegisterInformationForm } from '../components/ApplicantPortal/RegisterInformationForm'
import { ReSendApplicantTokenForm } from '../components/ApplicantPortal/ReSendApplicantTokenForm'
import { RetractApplicationModal } from '../components/ApplicantPortal/RetractApplicationModal'
import { SetPriorities } from '../components/ApplicantPortal/SetPriorities'
import { ApplicantStatusValues } from '../consts'
import { GET_APPLICATION_FROM_TOKEN } from '../queries'
import {
  GeApplicantFromTokenReturns,
  GetApplicantFromTokenVariables,
} from '../types.graphql'

interface ApplicantPortalParams {
  applicantToken: string
}

const translateStatusToStep = (status: ApplicantStatusValues): number => {
  switch (status) {
    case 'EMAIL_SENT':
      return 0
    case 'HAS_REGISTERED_PROFILE':
      return 1
    case 'HAS_SET_PRIORITIES':
      return 2
    case 'SCHEDULED_INTERVIEW':
      return 3
    default:
      return 0
  }
}

export const ApplicantPortal: React.VFC = () => {
  const [active, setActive] = useState(0)
  const [modalOpen, setModalOpen] = useState(false)
  const nextStep = () =>
    setActive(current => (current < 4 ? current + 1 : current))
  const { applicantToken } = useParams<ApplicantPortalParams>()

  const { data, loading, error } = useQuery<
    GeApplicantFromTokenReturns,
    GetApplicantFromTokenVariables
  >(GET_APPLICATION_FROM_TOKEN, {
    variables: { token: applicantToken },
    onCompleted({ getApplicantFromToken }) {
      setActive(translateStatusToStep(getApplicantFromToken.status))
    },
  })

  if (error) return <FullPageError />

  if (loading || !data) return <FullContentLoader />

  const { getApplicantFromToken: applicant } = data

  if (applicant === null)
    // Cannot find applicant. Render ReSendTokenForm
    return (
      <Center>
        <ReSendApplicantTokenForm />
      </Center>
    )

  if (applicant.status === 'RETRACTED_APPLICATION') {
    return (
      <Center>
        <Stack>
          <Title>KSG søkerportal</Title>
          <Text>Du har trukket søknaden din</Text>
        </Stack>
      </Center>
    )
  }

  if (applicant.status === 'DID_NOT_SHOW_UP_FOR_INTERVIEW') {
    return (
      <Center>
        <Stack>
          <Title>KSG søkerportal</Title>
          <Text>Du gikk glipp av intervjutidspunktet ditt. </Text>
        </Stack>
      </Center>
    )
  }

  return (
    <Center>
      <Stack>
        <Title>KSG søkerportal</Title>
        <Group>
          <Stepper active={active} breakpoint="sm">
            <Stepper.Step allowStepClick={false} label="Registrer personalia">
              <RegisterInformationForm
                nextStepCallback={nextStep}
                applicant={applicant}
              />
            </Stepper.Step>
            <Stepper.Step
              allowStepClick={false}
              label="Prioriter stillinger"
              description="Velg hvilke verv du søker i KSG"
            >
              <SetPriorities
                applicant={applicant}
                nextStepCallback={nextStep}
              />
            </Stepper.Step>
            <Stepper.Step
              allowStepClick={false}
              label="Book intervju"
              description="Finn et intervjutidspunkt som passer deg"
            >
              <InterviewBooking applicantToken={applicantToken} />
            </Stepper.Step>
            <Stepper.Completed>
              <Stack>
                <Text size="md">Takk for at har søkte KSG!</Text>
                <Title order={3}>Intervjuinformasjon</Title>
                <Group>
                  <Title order={4}>Hvor:</Title>
                  <Text>{applicant.interview?.location.name}</Text>
                </Group>
                <Stack>
                  <Title order={4}>Beskrivelse:</Title>
                  <Text>
                    {applicant.interview?.location.locationDescription}
                  </Text>
                </Stack>
                <Group>
                  <Title order={4}>Når:</Title>
                  <Text>
                    {applicant.interview &&
                      format(
                        new Date(applicant.interview.interviewStart),
                        'EEEE d MMMM H:mm'
                      )}
                  </Text>
                </Group>
                <Title order={3}>Prioriteringer</Title>
                <List>
                  {applicant.priorities.map(priority => {
                    if (priority === null) {
                      return null
                    }
                    return (
                      <List.Item key={priority.id}>
                        {priority.internalGroupPosition.name}
                      </List.Item>
                    )
                  })}
                </List>
                <Button color="red" onClick={() => setModalOpen(true)}>
                  Trekk søknad
                </Button>
                <RetractApplicationModal
                  opened={modalOpen}
                  setOpened={setModalOpen}
                  applicant={applicant}
                />
              </Stack>
            </Stepper.Completed>
          </Stepper>
        </Group>
      </Stack>
    </Center>
  )
}
