import { gql, useQuery } from '@apollo/client'
import { Button, Paper, Stack, Table, Title } from '@mantine/core'
import { FullContentLoader } from 'components/Loading'
import { MessageBox } from 'components/MessageBox'
import { format } from 'date-fns'
import { InterviewNode } from 'modules/admissions/types.graphql'
import { useHistory } from 'react-router-dom'

interface MyInterviewsReturns {
  myUpcomingInterviews: Pick<
    InterviewNode,
    'id' | 'interviewStart' | 'applicant' | 'location'
  >[]
}

const MY_UPCOMING_INTERVIEWS_QUERY = gql`
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

export const MyUpcomingInterviews: React.VFC = () => {
  const { loading, error, data } = useQuery<MyInterviewsReturns>(
    MY_UPCOMING_INTERVIEWS_QUERY
  )
  const history = useHistory()
  const handleRedirectToInterview = (applicantId: string) => {
    history.push(`/admissions/applicants/${applicantId}`)
  }

  if (error)
    return (
      <MessageBox type="danger">
        Kunne ikke hente fremtidige intervjuer
      </MessageBox>
    )

  if (loading || !data) return <FullContentLoader />

  const { myUpcomingInterviews } = data

  const rows = myUpcomingInterviews.map(interview => (
    <tr key={interview.id}>
      <td>{interview.applicant.fullName}</td>
      <td>{format(new Date(interview.interviewStart), 'iii d MMM HH:mm')}</td>
      <td>{interview.location.name}</td>
      <td>
        <Button
          onClick={() => {
            handleRedirectToInterview(interview.applicant.id)
          }}
        >
          Detaljer
        </Button>
      </td>
    </tr>
  ))

  return (
    <Stack>
      <Title order={2}>Mine kommende intervjuer</Title>
      <Paper p="sm" mb="md">
        <Table>
          <thead>
            <td>Tidspunkt</td>
            <td>Lokale</td>
            <td>Søker</td>
          </thead>
          <tbody>{rows}</tbody>
        </Table>
      </Paper>
    </Stack>
  )
}
