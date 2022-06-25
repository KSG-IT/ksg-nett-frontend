import { useQuery } from '@apollo/client'
import { Button, Paper, Stack, Table, Title } from '@mantine/core'
import { FullContentLoader } from 'components/Loading'
import { format } from 'date-fns'
import { gql } from 'graphql-tag'
import { InterviewNode } from './types'

interface MyInterviewsReturns {
  myInterviews: Pick<InterviewNode, 'id' | 'interviewStart' | 'applicant'>[]
}

const MY_INTERVIEWS_QUERY = gql`
  query MyInterviews {
    myInterviews {
      id
      interviewStart
      applicant {
        id
        fullName
      }
    }
  }
`

const useMyInterviews = () => {
  const { error, loading, data } =
    useQuery<MyInterviewsReturns>(MY_INTERVIEWS_QUERY)
  return {
    error,
    loading,
    data,
  }
}

export const MyInterviews: React.VFC = () => {
  const { error, data, loading } = useMyInterviews()

  if (loading || !data) return <FullContentLoader />
  console.log(data)

  const { myInterviews } = data

  const rows = myInterviews.map(interview => (
    <tr>
      <td>{interview.applicant.fullName}</td>
      <td>{format(new Date(interview.interviewStart), 'iii d MMM HH:mm')}</td>
      <td>
        <Button>Detaljer</Button>
      </td>
    </tr>
  ))

  return (
    <Stack>
      <Title>Mine intervjuer</Title>
      <Paper p="md">
        <Table>
          <thead>
            <tr>
              <td>Navn</td>
              <td>Tidspunkt</td>
              <td></td>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </Table>
      </Paper>
    </Stack>
  )
}
