import { useQuery } from '@apollo/client'
import { Button, createStyles, Group, Title } from '@mantine/core'
import { IconPlus, IconTrash } from '@tabler/icons'
import { FullPage404, FullPageError } from 'components/FullPageComponents'
import { FullContentLoader } from 'components/Loading'
import { MessageBox } from 'components/MessageBox'
import { PermissionGate } from 'components/PermissionGate'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { useNavigate, useParams } from 'react-router-dom'
import { PERMISSIONS } from 'util/permissions'
import {
  AddShiftTemplateModal,
  ShiftTemplateAccordion,
} from '../components/ScheduleTemplateDetails'
import { useScheduleTemplateMutations } from '../mutations.hooks'
import { ALL_SCHEDULE_TEMPLATES, SCHEDULE_TEMPLATE_QUERY } from '../queries'
import {
  ScheduleTemplateQueryReturns,
  ScheduleTemplateQueryVariables,
} from '../types.graphql'
interface ScheduleTemplateDetailsParams {
  templateId: string
}

export const ScheduleTemplateDetails: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false)
  const navigate = useNavigate()

  const { templateId } = useParams<
    keyof ScheduleTemplateDetailsParams
  >() as ScheduleTemplateDetailsParams

  const { data, loading, error } = useQuery<
    ScheduleTemplateQueryReturns,
    ScheduleTemplateQueryVariables
  >(SCHEDULE_TEMPLATE_QUERY, { variables: { id: templateId } })

  const { deleteScheduleTemplate } = useScheduleTemplateMutations()

  function handleDeleteScheduleTemplate() {
    const confirmed = window.confirm(
      'Er du sikker på at du vil slette denne vaktplan malen?'
    )
    if (confirmed) {
      deleteScheduleTemplate({
        variables: { id: templateId },
        refetchQueries: [ALL_SCHEDULE_TEMPLATES],
        onCompleted: () => {
          toast.success('Vaktplan malen ble slettet')
          navigate('/schedules/templates')
        },
        onError: () => {
          toast.error('Kunne ikke slette vaktplan malen')
        },
      })
    }
  }
  if (error) return <FullPageError />

  if (loading || !data) return <FullContentLoader />

  const { scheduleTemplate } = data

  if (!scheduleTemplate) return <FullPage404 />

  const { shiftTemplates } = scheduleTemplate

  return (
    <div>
      <Group position="apart" my="md">
        <Title>
          {scheduleTemplate.name} {scheduleTemplate.schedule.name}
        </Title>
        <Group>
          <PermissionGate
            permissions={PERMISSIONS.schedules.delete.scheduleTemplate}
          >
            <Button
              leftIcon={<IconTrash />}
              color="red"
              onClick={handleDeleteScheduleTemplate}
            >
              Slett mal
            </Button>
          </PermissionGate>
          <Button leftIcon={<IconPlus />} onClick={() => setModalOpen(true)}>
            Legg til vakt
          </Button>
        </Group>
      </Group>

      <MessageBox type="info">
        Her kan du definere en mal for en vaktplan. For hver vakt kan du legge
        til en rolle og antall personer som typisk skal være på en slik vakt.
      </MessageBox>
      <ShiftTemplateAccordion shiftTemplates={shiftTemplates} />
      <AddShiftTemplateModal
        open={modalOpen}
        onCloseCallback={() => setModalOpen(false)}
      />
    </div>
  )
}
