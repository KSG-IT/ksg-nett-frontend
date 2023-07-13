import { useQuery } from '@apollo/client'
import { Badge, createStyles, Stack, Title } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { CardTable } from 'components/CardTable'
import { FullPageError } from 'components/FullPageComponents'
import { FullContentLoader } from 'components/Loading'
import { MessageBox } from 'components/MessageBox'
import { format } from 'util/date-fns'
import { useInterviewMutations } from '../mutations.hooks'
import { parseApplicantPriorityInternalGroupPosition } from '../parsing'
import { FINISHED_INTERVIEWS_QUERY } from '../queries'
import { FinishedInterviewsReturns, InterviewNode } from '../types.graphql'
import { Breadcrumbs } from 'components/Breadcrumbs'

const breadcrumbsItems = [
  { label: 'Home', path: '/dashboard' },
  { label: 'Orvik', path: '/admissions' },
  { label: 'Fullførte intervjuer', path: '' },
]

export const FinishedInterviews: React.FC = () => {
  const { classes } = useStyles()
  const { data, loading, error } = useQuery<FinishedInterviewsReturns>(
    FINISHED_INTERVIEWS_QUERY,
    {
      pollInterval: 15_000,
    }
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
      <td>{interview.location.name}</td>
      <td>{format(new Date(interview.interviewStart), 'dd.MMM  HH:mm')}</td>
      <td>{interview.applicant.fullName}</td>
      <td>{interview.applicant.phone}</td>
      <td>{interview.applicant.email}</td>
      <td>
        {parseApplicantPriorityInternalGroupPosition(
          interview.applicant.priorities[0]
        )}
      </td>
      <td>
        {parseApplicantPriorityInternalGroupPosition(
          interview.applicant.priorities[1]
        )}
      </td>
      <td>
        {parseApplicantPriorityInternalGroupPosition(
          interview.applicant.priorities[2]
        )}
      </td>
    </tr>
  ))

  const missingInterviews = finishedInterviews.filter(
    interview => !interview.registeredAtSamfundet
  ).length

  return (
    <Stack>
      <Breadcrumbs items={breadcrumbsItems} />
      <Title>Fullførte intervjuer</Title>
      <MessageBox type="info">
        Oversikt over fullførte intervjuer og registreringsstatus på Samfundet
        sine opptakssider. Du kan endre registreringsstatus ved å klikke på
        statusen.
      </MessageBox>
      {missingInterviews > 0 ? (
        <MessageBox type="warning">
          Det er {missingInterviews} intervjuer som ikke er registrert på
          Samfundet sine opptakssider.
        </MessageBox>
      ) : (
        <MessageBox type="success">
          Alle intervjuer er registrert på Samfundet sine opptakssider.
        </MessageBox>
      )}

      <CardTable compact>
        <thead>
          <tr>
            <th>Status</th>
            <th>Intervjusted</th>
            <th>Intervjutidspunkt</th>
            <th>Søker</th>
            <th>Telefon</th>
            <th>E-post</th>
            <th>Førstevalg</th>
            <th>Andrevalg</th>
            <th>Tredjevalg</th>
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
