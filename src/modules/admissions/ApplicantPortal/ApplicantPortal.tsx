import { useMutation, useQuery } from '@apollo/client'
import { FullPageError } from 'components/FullPageComponents'
import { FullContentLoader } from 'components/Loading'
import { format } from 'date-fns'
import { PATCH_APPLICANT } from 'modules/admissions/mutations'
import { ApplicantNode, PatchApplicantReturns } from 'modules/admissions/types'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'
import { PatchMutationVariables } from 'types/graphql'
import {
  GeApplicantFromTokenReturns,
  GetApplicantFromTokenVariables,
} from '../types'
import { InterviewBooking } from './InterviewBooking'
import { GET_APPLICATION_FROM_TOKEN } from './queries'
import { RegisterProfileForm } from './RegisterProfileForm'
import { ReSendApplicantTokenForm } from './ReSendApplicantTokenForm'

const Wrapper = styled.div`
  margin: 0 auto;
`

const Title = styled.h1`
  margin: 0;
`

interface ApplicantPortalParams {
  applicantToken: string
}

export const ApplicantPortal: React.VFC = () => {
  const { applicantToken } = useParams<ApplicantPortalParams>()

  const { data, loading, error } = useQuery<
    GeApplicantFromTokenReturns,
    GetApplicantFromTokenVariables
  >(GET_APPLICATION_FROM_TOKEN, { variables: { token: applicantToken } })

  const [patchApplicant] = useMutation<
    PatchApplicantReturns,
    PatchMutationVariables<ApplicantNode>
  >(PATCH_APPLICANT, {
    refetchQueries: ['GetApplicantFromToken'],
  })

  if (error) return <FullPageError />

  if (loading || !data) return <FullContentLoader />

  const { getApplicantFromToken: applicant } = data

  if (applicant === null)
    // Cannot find applicant. Render ReSendTokenForm
    return (
      <Wrapper>
        <Title>KSG søkerportal</Title>
        <ReSendApplicantTokenForm />
      </Wrapper>
    )

  const handlePatchApplicant = () => {
    patchApplicant({
      variables: {
        id: applicant.id,
        input: { status: 'RETRACTED_APPLICATION' },
      },
    })
  }

  if (applicant.status === 'EMAIL_SENT')
    return (
      <Wrapper>
        <Title>KSG søkerportal</Title>
        <RegisterProfileForm applicant={applicant} />
      </Wrapper>
    )

  if (applicant.status === 'HAS_REGISTERED_PROFILE') {
    return (
      <Wrapper>
        Tilgjengelige intervjutider
        <InterviewBooking applicantToken={applicantToken} />
      </Wrapper>
    )
  }

  if (applicant.status === 'SCHEDULED_INTERVIEW') {
    return (
      <Wrapper>
        <p>
          Hei! Din intervjutid er{' '}
          {format(new Date(applicant.interview.interviewStart), 'EEE')} i
          {applicant.interview.location.name}
        </p>
      </Wrapper>
    )
  }

  if (applicant.status === 'INTERVIEW_FINISHED') {
    return (
      <Wrapper>
        <p>Takk for at du kom på intervju.</p>
        <p>Her er dine prioriteringer</p>
        {applicant.priorities.map(priority => {
          if (priority === null) {
            return null
          }
          return <span>{priority.internalGroupPosition.name}</span>
        })}
        <button onClick={handlePatchApplicant}>Trekk søknad</button>
      </Wrapper>
    )
  }

  if (applicant.status === 'RETRACTED_APPLICATION') {
    return <Wrapper>Du har trukket søknaden din. Nørd.</Wrapper>
  }

  if (applicant.status === 'DID_NOT_SHOW_UP_FOR_INTERVIEW') {
    return <Wrapper>Du møtte aldri opp til intevjuet. Send en mail til</Wrapper>
  }

  return (
    <Wrapper>
      <Title>KSG søkerportal</Title>
      Hei {applicant.fullName}
      Takk for at du har søkt KSG. Her kan du se intervjuetiden din. Om den er
      blank får du en telefon snart
    </Wrapper>
  )
}
