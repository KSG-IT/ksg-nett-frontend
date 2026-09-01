import { Group, Stack, Title } from '@mantine/core'
import { Breadcrumbs } from 'components/Breadcrumbs'
import { MessageBox } from 'components/MessageBox'
import { add, isSameDay } from 'date-fns'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { format } from 'util/date-fns'
import { WeekController } from '../components/ScheduleDetails'
import { AllergyMatrixTable } from '../components/ScheduleDetails/ScheduleAllergies/AllergyMatrixTable'
import { MOCK_ALLERGY_DATA } from './ScheduleAllergies.mock'

const breadcrumbItems = [
  { label: 'Hjem', path: '/dashboard' },
  { label: 'Vaktlister', path: '/schedules' },
  { label: 'Allergenoversikt', path: '' },
]

export interface AllergyQueryVariables {
  shiftsFrom: string
}

export interface AllergyQueryReturns {
  scheduleAllergies: {
    date: string
    totalUserCount: number
    allergyList: {
      name: string
      count: number
    }[]
  }[]
}

export const ScheduleAllergies: React.FC = () => {
  const [selectedDay, setSelectedDay] = useState<Date>(new Date())

  function handleNextDay() {
    setSelectedDay(date => add(date, { days: 1 }))
  }

  function handlePreviousDay() {
    setSelectedDay(date => add(date, { days: -1 }))
  }

  const dayData = MOCK_ALLERGY_DATA.find(d => isSameDay(d.date, selectedDay))
  const users = dayData?.users ?? []

  return (
    <Stack>
      <Breadcrumbs items={breadcrumbItems} />
      <Group position="apart">
        <Title order={1}>{format(selectedDay, 'EEEE d. MMMM')}</Title>
      </Group>
      <MessageBox type="info">
        Her har du oversikt over allergener per person for valgt dag. Oversikten
        forutsetter at folk er satt opp på vakt og har registrert allergenene
        sine under{' '}
        <Link style={{ fontWeight: 'bold' }} to="/users/me">
          innstillinger
        </Link>
        .
      </MessageBox>
      <WeekController
        value={selectedDay}
        onPrevious={handlePreviousDay}
        onNext={handleNextDay}
        label={format(selectedDay, 'd. MMM')}
      />
      <AllergyMatrixTable users={users} />
    </Stack>
  )
}

export default ScheduleAllergies
