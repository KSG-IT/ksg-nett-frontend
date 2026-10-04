import { gql, useQuery } from '@apollo/client'
import { Button, Stack, Table, Title } from '@mantine/core'
import { CardTable } from 'components/CardTable'
import { FullContentLoader } from 'components/Loading'
import { MessageBox } from 'components/MessageBox'
import { InterviewNode } from 'modules/admissions/types.graphql'
import { useNavigate } from 'react-router-dom'
import { format } from 'util/date-fns'

interface MyInterviewsReturns {
  myUpcomingInterviews: Pick<
    InterviewNode,
    'id' | 'interviewStart' | 'applicant' | 'location'
  >[]
}

export const MY_UPCOMING_INTERVIEWS_QUERY = gql`
  query MyUpcomingInterviews {
    myUpcomingInterviews {
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

export const MyUpcomingInterviews: React.FC = () => {
  const { loading, error, data } = useQuery<MyInterviewsReturns>(
    MY_UPCOMING_INTERVIEWS_QUERY
  )
  const navigate = useNavigate()
  const handleRedirectToInterview = (applicantId: string) => {
    navigate(`/admissions/applicants/${applicantId}`)
  }

  if (error)
    return (
      <MessageBox type="danger">
        Noe gikk galt. Kunne ikke hente fremtidige intervjuer
      </MessageBox>
    )

  if (loading || !data) return <FullContentLoader />

  const { myUpcomingInterviews } = data

  const rows = myUpcomingInterviews.map(interview => (
    <Table.Tr key={interview.id}>
      <Table.Td>{interview.applicant.fullName}</Table.Td>
      <Table.Td>
        {format(new Date(interview.interviewStart), 'iii d MMM HH:mm')}
      </Table.Td>
      <Table.Td>{interview.location.name}</Table.Td>
      <Table.Td>
        <Button
          color="samfundet-red"
          onClick={() => {
            handleRedirectToInterview(interview.applicant.id)
          }}
        >
          Detaljer
        </Button>
      </Table.Td>
    </Table.Tr>
  ))

  return (
    <Stack>
      <Title order={2}>Mine kommende intervjuer</Title>
      <CardTable>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Søker</Table.Th>
            <Table.Th>Tidspunkt</Table.Th>
            <Table.Th>Lokale</Table.Th>
            <Table.Th>Intervjuere</Table.Th>
            <Table.Th></Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </CardTable>
    </Stack>
  )
}
