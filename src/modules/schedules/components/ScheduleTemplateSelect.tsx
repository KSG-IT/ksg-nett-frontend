import { useQuery } from '@apollo/client'
import { Select, SelectProps } from '@mantine/core'
import { ALL_SCHEDULE_TEMPLATES } from '../queries'
import { AllScheduleTemplatesReturns } from '../types.graphql'

interface ScheduleTemplateSelectProps extends Omit<SelectProps, 'data'> {
  value: string
  onChange: (val: string) => void
}

export const ScheduleTemplateSelect: React.FC<ScheduleTemplateSelectProps> = ({
  value,
  onChange,
}) => {
  const { data } = useQuery<AllScheduleTemplatesReturns>(ALL_SCHEDULE_TEMPLATES)

  const schedules = data?.allScheduleTemplates ?? []

  const scheduleTemplateOptions = schedules.map(scheduleTemplate => ({
    value: scheduleTemplate.id,
    label: `${scheduleTemplate.name} - ${scheduleTemplate.schedule.name}`,
  }))

  return (
    <Select
      label="Vaktplan"
      placeholder="Velg vaktplan"
      value={value}
      onChange={onChange}
      data={scheduleTemplateOptions}
    />
  )
}
