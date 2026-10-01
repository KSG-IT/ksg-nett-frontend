import { gql, useQuery } from '@apollo/client'
import { Button, Card, Group, Stack, Table, Text, Title } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { Breadcrumbs } from 'components/Breadcrumbs'
import { MessageBox } from 'components/MessageBox'
import { add } from 'date-fns'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { format } from 'util/date-fns'
import { WeekController } from '../components/ScheduleDetails'

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
      totalUserCount
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
    totalUserCount: number
    allergyList: {
      name: string
      count: number
    }[]
  }[]
}

const MOCK_ALLERGIES = ['Peanøtter', 'Løk', 'Hvete', 'Gluten', 'Edamamebønner']

const NEW_MOCK_DATA = [
  { name: 'Alexander Orvik', allergies: MOCK_ALLERGIES.map(() => true) },
  { name: 'Sebastian Småladn', allergies: MOCK_ALLERGIES.map(() => false) },
]

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

  const totals = MOCK_ALLERGIES.reduce(
    (acc, curr) => ({ ...acc, [curr]: 0 }),
    {}
  )
  MOCK_ALLERGIES.forEach((allergy, index) => {
    NEW_MOCK_DATA.forEach((user, index2) => {
      const oldTotal = totals[allergy]

      if (user.allergies[index] === true) {
        totals[allergy] = oldTotal + 1
      }
    })
  })

  console.log(totals)

  return (
    <Stack>
      <Breadcrumbs items={breadcrumbItems} />
      <Group justify="space-between">
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

      {/* <AllergyDataList data={data} loading={loading} error={error} /> */}

      <Card>
        <Table style={{ overflowX: 'scroll' }}>
          <thead>
            <tr>
              <>
                <th>Navn</th>
                {MOCK_ALLERGIES.map(allergy => (
                  <th>{allergy}</th>
                ))}
              </>
            </tr>
          </thead>
          <tbody>
            {NEW_MOCK_DATA.map(user => (
              <tr>
                <td>{user.name}</td>
                <>
                  {user.allergies.map(allergy =>
                    allergy ? <td>✅</td> : <td>❌</td>
                  )}
                </>
              </tr>
            ))}
            <tr>
              <td>
                <Text fw="bold">Total</Text>
              </td>

              {Object.keys(totals).map(key => (
                <td>
                  <Text fw="bold">{totals[key]}</Text>
                </td>
              ))}
            </tr>
          </tbody>
        </Table>
      </Card>
    </Stack>
  )
}

export default ScheduleAllergies
