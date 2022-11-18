import { useQuery } from '@apollo/client'
import { Select, SelectProps } from '@mantine/core'
import { ALL_SCHEDULES } from '../queries'
import { AllSchedulesReturns } from '../types.graphql'

interface ScheduleSelectProps extends Omit<SelectProps, 'data'> {
  value: string
  onChange: (val: string) => void
}

export const ScheduleSelect: React.FC<ScheduleSelectProps> = ({
  value,
  onChange,
}) => {
  const { data } = useQuery<AllSchedulesReturns>(ALL_SCHEDULES)

  const schedules = data?.allSchedules ?? []

  const scheduleOptions = schedules.map(schedule => ({
    value: schedule.id,
    label: schedule.name,
  }))

  return (
    <Select
      label="Vaktplan"
      placeholder="Velg vaktplan"
      value={value}
      onChange={onChange}
      data={scheduleOptions}
    />
  )
}
