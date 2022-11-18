import { useQuery } from '@apollo/client'
import { Button, Group, Stack, Title } from '@mantine/core'
import { Breadcrumbs } from 'components/Breadcrumbs'
import { CardTable } from 'components/CardTable'
import { FullPageError } from 'components/FullPageComponents'
import { FullContentLoader } from 'components/Loading'
import { MessageBox } from 'components/MessageBox'
import { SynCButton } from 'components/SyncButton'
import { useState } from 'react'
import { format } from 'util/date-fns'
import { AssignInterviewModal } from '../components/AssignInterview'
import { ALL_AVAILABLE_INTERVIEWS_QUERY } from '../queries'
import { AllAvailableInterviewsReturns, InterviewNode } from '../types.graphql'

const breadcrumbsItems = [
  { label: 'Home', path: '/dashboard' },
  { label: 'Orvik', path: '/admissions' },
  { label: 'Korriger intervjuer', path: '/admissions/assign-interview' },
]

export const AssignInterview: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false)
  const [interview, setInterview] = useState<Pick<
    InterviewNode,
    'id' | 'location' | 'interviewStart' | 'interviewEnd'
  > | null>(null)
  const { loading, error, data, refetch } =
    useQuery<AllAvailableInterviewsReturns>(ALL_AVAILABLE_INTERVIEWS_QUERY, {
      fetchPolicy: 'network-only',
      pollInterval: 20_000,
    })

  if (error) return <FullPageError />

  if (loading || !data) return <FullContentLoader />

  const { allAvailableInterviews } = data

  function handleOpenModal(
    interview: Pick<
      InterviewNode,
      'id' | 'location' | 'interviewStart' | 'interviewEnd'
    >
  ) {
    setInterview(interview)

    setModalOpen(true)
  }

  const rows = allAvailableInterviews.map(interview => (
    <tr key={interview.id}>
      <td>{format(new Date(interview.interviewStart), 'EEEE d. MMMM')}</td>
      <td>
        {format(new Date(interview.interviewStart), 'HH:mm')} -{' '}
        {format(new Date(interview.interviewEnd), 'HH:mm')}
      </td>
      <td>{interview.location.name}</td>
      <td>
        <Button
          color="samfundet-red"
          variant="outline"
          onClick={() => handleOpenModal(interview)}
        >
          Tilby
        </Button>
      </td>
    </tr>
  ))

  return (
    <Stack>
      <Breadcrumbs items={breadcrumbsItems} />
      <Group position="apart">
        <Title>Intervjuallokerring</Title>
        <SynCButton
          refetchCallback={() => refetch()}
          refetchLoading={loading}
        />
      </Group>
      <MessageBox type="info">
        Her har du mulighet til å gi noen et nytt intervju. Det kan hende at du
        booker et intervju samtidig som en annen søker.
      </MessageBox>

      <CardTable>
        <thead>
          <tr>
            <th>Dato</th>
            <th>Tidspunkt</th>
            <th>Hvor</th>
            <th></th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </CardTable>
      <AssignInterviewModal
        interview={interview}
        opened={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </Stack>
  )
}
