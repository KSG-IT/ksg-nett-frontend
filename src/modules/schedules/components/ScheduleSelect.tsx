import { useQuery } from '@apollo/client'
import { Select } from '@mantine/core'
import { ALL_SCHEDULES } from '../queries'
import { AllSchedulesReturns } from '../types.graphql'

interface ScheduleSelectProps {
  value: string
  onChangeCallback: (val: string) => void
}

export const ScheduleSelect: React.FC<ScheduleSelectProps> = ({
  value,
  onChangeCallback,
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
      onChange={onChangeCallback}
      data={scheduleOptions}
    />
  )
}
