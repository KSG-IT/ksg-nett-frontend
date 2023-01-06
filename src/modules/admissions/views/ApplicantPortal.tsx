import { useQuery } from '@apollo/client'
import { Center, Group, Stack, Stepper, Text, Title } from '@mantine/core'
import { FullPageError } from 'components/FullPageComponents'
import { FullContentLoader } from 'components/Loading'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { ApplicantSummary } from '../components/ApplicantPortal/components'
import { InterviewBooking } from '../components/ApplicantPortal/InterviewBooking'
import { RegisterInformationForm } from '../components/ApplicantPortal/RegisterInformationForm'
import { ReSendApplicantTokenForm } from '../components/ApplicantPortal/ReSendApplicantTokenForm'
import { SetPriorities } from '../components/ApplicantPortal/SetPriorities'
import { ApplicantStatusValues } from '../consts'
import { GET_APPLICATION_FROM_TOKEN } from '../queries'
import {
  GeApplicantFromTokenReturns,
  GetApplicantFromTokenVariables,
} from '../types.graphql'

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
    case 'INTERVIEW_FINISHED':
      return 3
    default:
      return 0
  }
}

interface ApplicantPortalParams {
  applicantToken: string
}

export const ApplicantPortal: React.FC = () => {
  const [active, setActive] = useState(0)
  const nextStep = () =>
    setActive(current => (current < 4 ? current + 1 : current))
  const { applicantToken } = useParams<
    keyof ApplicantPortalParams
  >() as ApplicantPortalParams

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

  if (applicant.status === 'INTERVIEW_FINISHED') {
    return (
      <Center>
        <Stack>
          <Title>KSG søkerportal</Title>
          <ApplicantSummary applicant={applicant} />
        </Stack>
      </Center>
    )
  }

  return (
    <Center>
      <Stack p="md">
        <Title>KSG søkerportal</Title>
        <Group>
          <Stepper color="samfundet-red" active={active} breakpoint="sm">
            <Stepper.Step allowStepClick={false} label="Registrer personalia">
              <RegisterInformationForm applicant={applicant} />
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
              <ApplicantSummary applicant={applicant} />
            </Stepper.Completed>
          </Stepper>
        </Group>
      </Stack>
    </Center>
  )
}
