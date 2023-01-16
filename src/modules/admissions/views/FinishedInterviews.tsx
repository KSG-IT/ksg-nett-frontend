import { gql, useQuery } from '@apollo/client'
import { Badge, createStyles, Stack, Title } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { CardTable } from 'components/CardTable'
import { FullPageError } from 'components/FullPageComponents'
import { FullContentLoader } from 'components/Loading'
import { MessageBox } from 'components/MessageBox'
import { format } from 'util/date-fns'
import { useInterviewMutations } from '../mutations.hooks'
import { InterviewNode } from '../types.graphql'

const FINISHED_INTERVIEWS_QUERY = gql`
  query FinishedInterviewsQuery {
    finishedInterviews {
      id
      applicant {
        id
        fullName
        email
        phone
      }
      location {
        id
        name
      }
      interviewStart
      registeredAtSamfundet
    }
  }
`

interface FinishedInterviewsReturns {
  finishedInterviews: Pick<
    InterviewNode,
    'id' | 'registeredAtSamfundet' | 'applicant' | 'location' | 'interviewStart'
  >[]
}

export const FinishedInterviews: React.FC = () => {
  const { classes } = useStyles()
  const { data, loading, error } = useQuery<FinishedInterviewsReturns>(
    FINISHED_INTERVIEWS_QUERY
  )

  const { patchInterview } = useInterviewMutations()

  if (error) return <FullPageError />

  if (loading || !data) return <FullContentLoader />

  const { finishedInterviews } = data ?? []

  function handleRegisteredAtSamfundetChange(
    interview: Pick<InterviewNode, 'id' | 'registeredAtSamfundet'>
  ) {
    patchInterview({
      variables: {
        id: interview.id,
        input: {
          registeredAtSamfundet: !interview.registeredAtSamfundet,
        },
      },
      optimisticResponse: {
        patchInterview: {
          id: interview.id,
          registeredAtSamfundet: !interview.registeredAtSamfundet,
        },
      },
      refetchQueries: [FINISHED_INTERVIEWS_QUERY],
      onError({ message }) {
        showNotification({
          title: 'Kunne ikke oppdatere registrering',
          message,
        })
      },
    })
  }

  const rows = finishedInterviews.map(interview => (
    <tr key={interview.id}>
      <td>{interview.applicant.fullName}</td>
      <td>{interview.applicant.phone}</td>
      <td>{interview.applicant.email}</td>
      <td>{interview.location.name}</td>
      <td>{format(new Date(interview.interviewStart), 'HH:mm')}</td>
      <td>
        {interview.registeredAtSamfundet ? (
          <Badge
            color="green"
            onClick={() => handleRegisteredAtSamfundetChange(interview)}
            className={classes.statusBadge}
          >
            Registert
          </Badge>
        ) : (
          <Badge
            color="red"
            onClick={() => handleRegisteredAtSamfundetChange(interview)}
            className={classes.statusBadge}
          >
            Ikke registrert
          </Badge>
        )}
      </td>
    </tr>
  ))

  const missingInterviews =
    finishedInterviews.filter(interview => !interview.registeredAtSamfundet)
      .length > 0

  return (
    <Stack>
      <Title>Fullførte intervjuer</Title>
      <MessageBox type="info">
        Oversikt over fullførte intervjuer og registreringsstatus på Samfundet
        sine opptakssider. Du kan endre registreringsstatus ved å klikke på
        statusen.
      </MessageBox>
      {missingInterviews ? (
        <MessageBox type="warning">
          Det er {missingInterviews} intervjuer som ikke er registrert på
          Samfundet sine opptakssider.
        </MessageBox>
      ) : (
        <MessageBox type="success">
          Alle intervjuer er registrert på Samfundet sine opptakssider.
        </MessageBox>
      )}

      <CardTable>
        <thead>
          <tr>
            <th>Søker</th>
            <th>Telefon</th>
            <th>E-post</th>
            <th>Intervjusted</th>
            <th>Intervjutidspunkt</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </CardTable>
    </Stack>
  )
}

const useStyles = createStyles(() => ({
  statusBadge: {
    cursor: 'pointer',
    ':hover': {
      textDecoration: 'underline',
    },
  },
}))
