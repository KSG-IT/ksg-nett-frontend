import { useQuery } from '@apollo/client'
import { Button, createStyles, Group, Title } from '@mantine/core'
import { IconPlus } from '@tabler/icons-react'
import { Breadcrumbs } from 'components/Breadcrumbs'
import { FullPageError } from 'components/FullPageComponents'
import { FullContentLoader } from 'components/Loading'
import { PermissionGate } from 'components/PermissionGate'
import { useState } from 'react'
import { PERMISSIONS } from 'util/permissions'
import {
  CreateScheduleTemplateModal,
  ScheduleTemplateTable,
} from '../components/ScheduleTemplates'
import { ALL_SCHEDULE_TEMPLATES } from '../queries'
import { AllScheduleTemplatesReturns } from '../types.graphql'

const breadcrumbItems = [
  { label: 'Hjem', path: '/dashboard' },
  { label: 'Vaktlister', path: '/schedules' },
  { label: 'Vaktplanmaler', path: '/schedules/templates' },
]

export const ScheduleTemplates: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false)
  const { classes } = useScheduleTemplateStyles()
  const { data, loading, error } = useQuery<AllScheduleTemplatesReturns>(
    ALL_SCHEDULE_TEMPLATES
  )

  if (error) return <FullPageError />

  if (loading || !data) return <FullContentLoader />

  const { allScheduleTemplates } = data

  return (
    <div className={classes.wrapper}>
      <Breadcrumbs items={breadcrumbItems} />
      <Group position="apart" my="md">
        <Title>Vaktplan maler</Title>
        <PermissionGate
          permissions={PERMISSIONS.schedules.add.scheduleTemplate}
        >
          <Button
            color="samfundet-red"
            leftIcon={<IconPlus />}
            onClick={() => setModalOpen(true)}
          >
            Opprett ny mal
          </Button>
        </PermissionGate>
      </Group>
      <ScheduleTemplateTable scheduleTemplates={allScheduleTemplates} />
      <CreateScheduleTemplateModal
        open={modalOpen}
        onCloseCallback={() => setModalOpen(false)}
      />
    </div>
  )
}

const useScheduleTemplateStyles = createStyles(theme => ({
  wrapper: {},
}))
