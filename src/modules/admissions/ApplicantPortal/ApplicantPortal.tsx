import { useQuery } from '@apollo/client'
import { FullPageError } from 'components/FullPageComponents'
import { FullContentLoader } from 'components/Loading'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'
import { GET_APPLICATION_FROM_TOKEN } from '../queries'
import {
  GeApplicantFromTokenReturns,
  GetApplicantFromTokenVariables,
} from '../types'
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

  console.log(applicant)
  if (applicant.status !== 'HAS_REGISTERED_PROFILE')
    return (
      <Wrapper>
        <Title>KSG søkerportal</Title>
        <RegisterProfileForm applicant={applicant} />
      </Wrapper>
    )

  return (
    <Wrapper>
      <Title>KSG søkerportal</Title>
      Hei {applicant.fullName}
      Takk for at du har søkt KSG. Her kan du se intervjuetiden din. Om den er
      blank får du en telefon snart
    </Wrapper>
  )
}
