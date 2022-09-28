import { useQuery } from '@apollo/client'
import { Button, Paper, Stack, Table, Title } from '@mantine/core'
import { FullPageError } from 'components/FullPageComponents'
import { FullContentLoader } from 'components/Loading'
import { format } from 'util/date-fns'
import { gql } from 'graphql-tag'
import { useNavigate } from 'react-router-dom'
import { InterviewNode } from '../types.graphql'

interface MyInterviewsReturns {
  myInterviews: Pick<
    InterviewNode,
    'id' | 'interviewStart' | 'applicant' | 'location'
  >[]
}

const MY_INTERVIEWS_QUERY = gql`
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
  const navigate = useNavigate()

  if (error) return <FullPageError />

  if (loading || !data) return <FullContentLoader />

  const { myInterviews } = data

  const handleRedirectToInterview = (applicantId: string) => {
    navigate(`/admissions/applicants/${applicantId}`)
  }

  const rows = myInterviews.map(interview => (
    <tr>
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
    <Stack style={{ overflowY: 'scroll', width: '100%' }} p="lg">
      <Title>Mine intervjuer</Title>
      <Paper p="md">
        <Table>
          <thead>
            <tr>
              <td>Navn</td>
              <td>Tidspunkt</td>
              <td>Sted</td>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </Table>
      </Paper>
    </Stack>
  )
}
