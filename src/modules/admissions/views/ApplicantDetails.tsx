import { useQuery } from '@apollo/client'
import { Button, Group, Stack, Table, Title } from '@mantine/core'
import { Breadcrumbs } from 'components/Breadcrumbs'
import { CardTable } from 'components/CardTable'
import { FullPage404, FullPageError } from 'components/FullPageComponents'
import { FullContentLoader } from 'components/Loading'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import {
  ApplicantComments,
  ApplicantRecommendationModal,
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

export const ApplicantDetails: React.FC = () => {
  const [recommendationModalOpen, setRecommendationModalOpen] = useState(false)
  const { applicantId } = useParams<
    keyof ApplicantDetailsParams
  >() as ApplicantDetailsParams

  const { data, loading, error } = useQuery<
    ApplicantQueryReturns,
    ApplicantQueryVariables
  >(APPLICANT_QUERY, {
    variables: { id: applicantId },
    pollInterval: 10_000,
    fetchPolicy: 'network-only',
  })

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
    <Stack>
      <Title order={2}>Kandidatdetaljer</Title>
      <Breadcrumbs
        items={[
          {
            path: '/admissions',
            label: 'Orvik',
          },
          {
            path: `/admissions/applicants/${applicant.id}`,
            label: `${applicant.fullName}`,
          },
        ]}
      />
      <Group gap="xl">
        <Title order={2}>{applicant.fullName}</Title>
        <Button onClick={() => setRecommendationModalOpen(true)}>
          Anbefal
        </Button>
      </Group>
      <PersonalDetailsCard applicant={applicant} />
      <CardTable>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Førstevalg</Table.Th>
            <Table.Th>Andrevalg</Table.Th>
            <Table.Th>Tredjevalg</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          <Table.Tr>
            <Table.Td>
              {applicant.priorities[0]?.internalGroupPosition?.name}
            </Table.Td>
            <Table.Td>
              {applicant.priorities[1]?.internalGroupPosition?.name}
            </Table.Td>
            <Table.Td>
              {applicant.priorities[2]?.internalGroupPosition?.name}
            </Table.Td>
          </Table.Tr>
        </Table.Tbody>
      </CardTable>
      <InterviewDetails applicant={applicant} canEdit={!cannotEdit} />
      <ApplicantComments applicant={applicant} />
      <ApplicantRecommendationModal
        applicantId={applicant.id}
        isOpen={recommendationModalOpen}
        onClose={() => setRecommendationModalOpen(false)}
      />
    </Stack>
  )
}
