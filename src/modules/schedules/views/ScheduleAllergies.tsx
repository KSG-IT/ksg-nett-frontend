import { Card, Group, Loader, Stack, Title } from '@mantine/core'
import { Breadcrumbs } from 'components/Breadcrumbs'
import { format } from 'util/date-fns'
import { WeekController } from '../components/ScheduleDetails'
import { useState } from 'react'
import { add } from 'date-fns'
import { gql, useQuery } from '@apollo/client'
import { FullPage404, FullPageError } from 'components/FullPageComponents'
import { FullContentLoader } from 'components/Loading'

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

interface AllergyQueryVariables {
  shiftsFrom: string
}

interface AllergyQueryReturns {
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
  const { data, error, loading } = useQuery<
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

  if (error) return <FullPageError />

  if (loading || !data) return <FullContentLoader />

  console.log(data)

  if (data === null) return <FullPage404 />

  const { scheduleAllergies } = data

  return (
    <Stack>
      <Breadcrumbs items={breadcrumbItems} />
      <Title order={1}>Allergenoversikt uke {format(shiftsFrom, 'w')}</Title>
      <WeekController
        week={shiftsFrom}
        previousWeekCallback={handlePreviousWeek}
        nextWeekCallback={handleNextWeek}
      />

      <Group>
        {scheduleAllergies.map(day => (
          <Card>
            <Stack>
              <b>{format(new Date(day.date), 'EEEE d MMMM')}</b>
              {day.allergyList.map(allergy => (
                <span>
                  {allergy.name}: {allergy.count}
                </span>
              ))}
            </Stack>
          </Card>
        ))}
      </Group>
    </Stack>
  )
}

export default ScheduleAllergies
