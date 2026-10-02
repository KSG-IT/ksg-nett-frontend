import { useQuery } from '@apollo/client'
import { Stack, Table, Title } from '@mantine/core'
import { Badge } from 'components/Badge'
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
import { createStyles } from '@mantine/emotion'

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
    <Table.Tr key={interview.id}>
      <Table.Td>
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
      </Table.Td>
      <Table.Td>{interview.location.name}</Table.Td>
      <Table.Td>
        {format(new Date(interview.interviewStart), 'dd.MMM  HH:mm')}
      </Table.Td>
      <Table.Td>{interview.applicant.fullName}</Table.Td>
      <Table.Td>{interview.applicant.phone}</Table.Td>
      <Table.Td>{interview.applicant.email}</Table.Td>
      <Table.Td>
        {parseApplicantPriorityInternalGroupPosition(
          interview.applicant.priorities[0]
        )}
      </Table.Td>
      <Table.Td>
        {parseApplicantPriorityInternalGroupPosition(
          interview.applicant.priorities[1]
        )}
      </Table.Td>
      <Table.Td>
        {parseApplicantPriorityInternalGroupPosition(
          interview.applicant.priorities[2]
        )}
      </Table.Td>
    </Table.Tr>
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
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Status</Table.Th>
            <Table.Th>Intervjusted</Table.Th>
            <Table.Th>Intervjutidspunkt</Table.Th>
            <Table.Th>Søker</Table.Th>
            <Table.Th>Telefon</Table.Th>
            <Table.Th>E-post</Table.Th>
            <Table.Th>Førstevalg</Table.Th>
            <Table.Th>Andrevalg</Table.Th>
            <Table.Th>Tredjevalg</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
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
