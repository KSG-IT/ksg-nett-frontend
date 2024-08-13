import { gql, useQuery } from '@apollo/client'
import { Button, Group, Stack, Title } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { Breadcrumbs } from 'components/Breadcrumbs'
import { MessageBox } from 'components/MessageBox'
import { add } from 'date-fns'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { format } from 'util/date-fns'
import { WeekController } from '../components/ScheduleDetails'
import { AllergyDataList } from '../components/ScheduleDetails/ScheduleAllergies/AllergyDataList'

const breadcrumbItems = [
  {
    label: 'Hjem',
    path: '/dashboard',
  },
  {
    label: 'Vaktlister',
    path: '/schedules',
  },
  {
    label: 'Allergenoversikt',
    path: '',
  },
]

const ALLERGY_FOR_WEEK_QUERY = gql`
  query AllergyForWeekQuery($shiftsFrom: Date!) {
    scheduleAllergies(shiftsFrom: $shiftsFrom) {
      date
      allergyList {
        name
        count
      }
    }
  }
`

export interface AllergyQueryVariables {
  shiftsFrom: string
}

export interface AllergyQueryReturns {
  scheduleAllergies: {
    date: string
    allergyList: {
      name: string
      count: number
    }[]
  }[]
}
const ScheduleAllergies: React.FC = () => {
  const [shiftsFrom, setShiftsFrom] = useState<Date>(new Date())

  const { data, error, loading, refetch } = useQuery<
    AllergyQueryReturns,
    AllergyQueryVariables
  >(ALLERGY_FOR_WEEK_QUERY, {
    variables: { shiftsFrom: format(shiftsFrom, 'yyyy-MM-dd') },
  })

  function handleNextWeek() {
    setShiftsFrom(date => add(date, { weeks: 1 }))
  }

  function handlePreviousWeek() {
    setShiftsFrom(date => add(date, { weeks: -1 }))
  }

  function handleRefetch() {
    refetch().then(() =>
      showNotification({
        message: 'Allergenoversikt oppdatert',
        color: 'green',
      })
    )
  }

  return (
    <Stack>
      <Breadcrumbs items={breadcrumbItems} />
      <Group position="apart">
        <Title order={1}>Allergenoversikt uke {format(shiftsFrom, 'w')}</Title>
        <Button onClick={handleRefetch}>Oppdater</Button>
      </Group>
      <MessageBox type="info">
        Her har du oversikt over allergener for hver dag i uken. Oversikten
        forutsetter at noen er satt opp på vakt den dagen og har registrert
        allergenene sine riktig under{' '}
        <Link style={{ fontWeight: 'bold' }} to="/users/me">
          innstillinger
        </Link>
      </MessageBox>
      <WeekController
        week={shiftsFrom}
        previousWeekCallback={handlePreviousWeek}
        nextWeekCallback={handleNextWeek}
      />

      <AllergyDataList data={data} loading={loading} error={error} />
    </Stack>
  )
}

export default ScheduleAllergies
