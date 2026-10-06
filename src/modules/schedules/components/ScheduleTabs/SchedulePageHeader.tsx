import { Stack, Title } from '@mantine/core'
import { Breadcrumbs } from 'components/Breadcrumbs'
import { ScheduleTabs } from './ScheduleTabs'

interface SchedulePageHeaderProps {
  schedule: { id: string; name: string; canManage: boolean }
  page: string
}

// The header of the Roster and Regler pages
export const SchedulePageHeader: React.FC<SchedulePageHeaderProps> = ({
  schedule,
  page,
}) => (
  <Stack gap="sm">
    <Breadcrumbs
      items={[
        { label: 'Hjem', path: '/dashboard' },
        { label: 'Vaktplaner', path: '/schedules' },
        { label: schedule.name, path: `/schedules/${schedule.id}/v2` },
        { label: page, path: '' },
      ]}
    />
    <Title>{schedule.name}</Title>
    <ScheduleTabs scheduleId={schedule.id} canManage={schedule.canManage} />
  </Stack>
)
