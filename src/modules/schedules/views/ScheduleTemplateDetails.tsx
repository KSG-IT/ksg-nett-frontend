import { useQuery } from '@apollo/client'
import { Button, Group, Title } from '@mantine/core'
import { IconPlus } from '@tabler/icons'
import { FullPage404, FullPageError } from 'components/FullPageComponents'
import { FullContentLoader } from 'components/Loading'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import {
  AddShiftTemplateModal,
  ShiftTemplateTable,
} from '../components/ScheduleTemplateDetails'
import { SCHEDULE_TEMPLATE_QUERY } from '../queries'
import {
  ScheduleTemplateQueryReturns,
  ScheduleTemplateQueryVariables,
} from '../types.graphql'

interface ScheduleTemplateDetailsParams {
  id: string
}

export const ScheduleTemplateDetails: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false)
  const { id } = useParams<
    keyof ScheduleTemplateDetailsParams
  >() as ScheduleTemplateDetailsParams

  const { data, loading, error } = useQuery<
    ScheduleTemplateQueryReturns,
    ScheduleTemplateQueryVariables
  >(SCHEDULE_TEMPLATE_QUERY, { variables: { id } })

  if (error) return <FullPageError />

  if (loading || !data) return <FullContentLoader />

  const { scheduleTemplate } = data

  if (!scheduleTemplate) return <FullPage404 />

  const { name, shiftTemplates } = scheduleTemplate

  return (
    <div>
      <Group position="apart" my="md">
        <Title>
          {scheduleTemplate.name} {scheduleTemplate.schedule.name}
        </Title>
        <Button leftIcon={<IconPlus />} onClick={() => setModalOpen(true)}>
          Legg til vakt
        </Button>
      </Group>
      <ShiftTemplateTable shiftTemplates={shiftTemplates} />
      <AddShiftTemplateModal
        open={modalOpen}
        onCloseCallback={() => setModalOpen(false)}
      />
    </div>
  )
}
