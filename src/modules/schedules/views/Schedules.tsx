import { useQuery } from '@apollo/client'
import { Button, Group, Stack, Title } from '@mantine/core'
import { Breadcrumbs } from 'components/Breadcrumbs'
import { FullPageError } from 'components/FullPageComponents'
import { FullContentLoader } from 'components/Loading'
import { MessageBox } from 'components/MessageBox'
import { Link } from 'react-router-dom'
import { ScheduleOverviewList } from '../components/Schedules'
import { SCHEDULES_OVERVIEW_QUERY } from '../queries'
import { SchedulesOverviewReturns } from '../types.graphql'

const breadcrumbItems = [
  { label: 'Hjem', path: '/dashboard' },
  { label: 'Vaktplaner', path: '/schedules' },
]

export const Schedules: React.FC = () => {
  const { data, loading, error } = useQuery<SchedulesOverviewReturns>(
    SCHEDULES_OVERVIEW_QUERY
  )

  if (error) return <FullPageError />
  if (loading || !data) return <FullContentLoader />

  return (
    <Stack gap="md" maw={1100}>
      <Breadcrumbs items={breadcrumbItems} />
      <Group justify="space-between" align="center">
        <Title>Vaktplaner</Title>
        <Group gap="xs">
          <Button component={Link} to="/schedules/templates" variant="default">
            Maler
          </Button>
          <Button component={Link} to="/schedules/allergies" variant="default">
            Allergener
          </Button>
        </Group>
      </Group>
      {data.allSchedules.length === 0 ? (
        <MessageBox type="info">Det finnes ingen vaktplaner.</MessageBox>
      ) : (
        <ScheduleOverviewList schedules={data.allSchedules} />
      )}
    </Stack>
  )
}
