import { useQuery } from '@apollo/client'
import { Button, Group, Stack, Table, Title } from '@mantine/core'
import { IconEye } from '@tabler/icons-react'
import { Breadcrumbs } from 'components/Breadcrumbs'
import { CardTable } from 'components/CardTable'
import { FullPageError } from 'components/FullPageComponents'
import { FullContentLoader } from 'components/Loading'
import { SynCButton } from 'components/SyncButton'
import { gql } from 'graphql-tag'
import { useNavigate } from 'react-router-dom'
import { format } from 'util/date-fns'
import { InterviewNode } from '../types.graphql'

const breadcrumbsItems = [
  { label: 'Hjem', path: '/dashboard' },
  { label: 'Orvik', path: '/admissions' },
  { label: 'Mine intervjuer', path: '/admissions/my-interviews' },
]

interface MyInterviewsReturns {
  myInterviews: Pick<
    InterviewNode,
    'id' | 'interviewStart' | 'applicant' | 'location'
  >[]
}

export const MY_INTERVIEWS_QUERY = gql`
  query MyInterviews {
    myInterviews {
      id
      interviewStart
      location {
        id
        name
      }
      applicant {
        id
        fullName
      }
    }
  }
`

const useMyInterviews = () => {
  const { error, loading, data, refetch } =
    useQuery<MyInterviewsReturns>(MY_INTERVIEWS_QUERY)
  return {
    error,
    loading,
    data,
    refetch,
  }
}

export const MyInterviews: React.FC = () => {
  const { error, data, loading, refetch } = useMyInterviews()
  const navigate = useNavigate()

  if (error) return <FullPageError />

  if (loading || !data) return <FullContentLoader />

  const { myInterviews } = data

  const handleRedirectToInterview = (applicantId: string) => {
    navigate(`/admissions/applicants/${applicantId}`)
  }

  const rows = myInterviews.map(interview => (
    <Table.Tr key={interview.id}>
      <Table.Td>
        {interview.applicant !== null
          ? interview.applicant.fullName
          : 'Ingen søker'}
      </Table.Td>
      <Table.Td>
        {format(new Date(interview.interviewStart), 'iii d MMM HH:mm')}
      </Table.Td>
      <Table.Td>{interview.location.name}</Table.Td>
      <Table.Td>
        <Button
          color="samfundet-red"
          leftSection={<IconEye />}
          onClick={() => {
            handleRedirectToInterview(interview.applicant.id)
          }}
        >
          Mer info
        </Button>
      </Table.Td>
    </Table.Tr>
  ))

  return (
    <Stack>
      <Breadcrumbs items={breadcrumbsItems} />
      <Group justify="space-between">
        <Title>Mine intervjuer</Title>
        <SynCButton
          refetchCallback={() => refetch()}
          refetchLoading={loading}
        />
      </Group>
      <CardTable>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Navn</Table.Th>
            <Table.Th>Tidspunkt</Table.Th>
            <Table.Th>Sted</Table.Th>
            <Table.Th></Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </CardTable>
    </Stack>
  )
}
