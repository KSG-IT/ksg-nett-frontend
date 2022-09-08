import { useQuery } from '@apollo/client'
import { ScrollArea, Title } from '@mantine/core'
import { FullPage404, FullPageError } from 'components/FullPageComponents'
import { FullContentLoader } from 'components/Loading'
import { useParams } from 'react-router-dom'
import {
  ApplicantComments,
  InterviewDetails,
  PersonalDetailsCard,
} from '../components/ApplicantDetails'
import { ApplicantStatusValues } from '../consts'
import { APPLICANT_QUERY } from '../queries'
import {
  ApplicantQueryReturns,
  ApplicantQueryVariables,
} from '../types.graphql'

interface ApplicantDetailsParams {
  applicantId: string
}

export const ApplicantDetails: React.VFC = () => {
  const { applicantId } = useParams<ApplicantDetailsParams>()

  const { data, loading, error } = useQuery<
    ApplicantQueryReturns,
    ApplicantQueryVariables
  >(APPLICANT_QUERY, { variables: { id: applicantId }, pollInterval: 10000 })

  if (error) return <FullPageError />

  if (loading || !data) return <FullContentLoader />

  const { applicant } = data

  if (applicant === null) return <FullPage404 />

  // This is probably a bit flaky.
  const interviewFinished =
    applicant.status === ApplicantStatusValues.INTERVIEW_FINISHED
  const didNotShowUp =
    applicant.status === ApplicantStatusValues.DID_NOT_SHOW_UP_FOR_INTERVIEW

  const cannotEdit = interviewFinished || didNotShowUp

  return (
    <ScrollArea style={{ width: '100%' }} p="lg">
      <Title order={2}>Kandidatdetaljer</Title>
      <PersonalDetailsCard applicant={applicant} />
      <InterviewDetails applicant={applicant} canEdit={!cannotEdit} />
      <ApplicantComments applicant={applicant} />
    </ScrollArea>
  )
}
