import { gql, useQuery } from '@apollo/client'
import {
  Button,
  Group,
  SegmentedControl,
  Stack,
  Table,
  Text,
  Title,
} from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { IconCheck } from '@tabler/icons-react'
import { Breadcrumbs } from 'components/Breadcrumbs'
import { FullPageError } from 'components/FullPageComponents'
import { FullContentLoader } from 'components/Loading'
import { MessageBox } from 'components/MessageBox'
import { UserCell } from 'components/Table'
import { add } from 'date-fns'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { format } from 'util/date-fns'
import { allergyView, AllergyWeek } from '../allergyWeek'
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

const SCHEDULE_ALLERGIES_V2_QUERY = gql`
  query ScheduleAllergiesV2($shiftsFrom: Date!) {
    scheduleAllergiesV2(shiftsFrom: $shiftsFrom) {
      allergies
      users {
        userId
        name
        allergies
        days
      }
      allergyCounts
      peopleAtWork
      days {
        date
        peopleAtWork
      }
    }
  }
`

interface ScheduleAllergiesV2Returns {
  scheduleAllergiesV2: AllergyWeek
}

interface ScheduleAllergiesV2Variables {
  shiftsFrom: string
}

const ScheduleAllergies: React.FC = () => {
  const [shiftsFrom, setShiftsFrom] = useState<Date>(new Date())
  // null: the whole week
  const [day, setDay] = useState<string | null>(null)

  const { data, error, loading, refetch } = useQuery<
    ScheduleAllergiesV2Returns,
    ScheduleAllergiesV2Variables
  >(SCHEDULE_ALLERGIES_V2_QUERY, {
    variables: { shiftsFrom: format(shiftsFrom, 'yyyy-MM-dd') },
  })

  function changeWeek(weeks: number) {
    setShiftsFrom(date => add(date, { weeks }))
    setDay(null)
  }

  function handleRefetch() {
    refetch().then(() =>
      showNotification({
        message: 'Allergenoversikt oppdatert',
        color: 'green',
      })
    )
  }

  const week = data?.scheduleAllergiesV2
  const view = week ? allergyView(week, day) : null
  const dayOptions = [
    { value: 'week', label: 'Hele uka' },
    ...(week?.days ?? []).map(workDay => ({
      value: workDay.date,
      label: format(new Date(`${workDay.date}T12:00`), 'EEE d.'),
    })),
  ]

  return (
    <Stack>
      <Breadcrumbs items={breadcrumbItems} />
      <Group justify="space-between">
        <Title order={1}>Allergenoversikt uke {format(shiftsFrom, 'w')}</Title>
        <Button onClick={handleRefetch}>Oppdater</Button>
      </Group>
      <MessageBox type="info">
        Her ser du allergenene til alle som står på vakt denne uken, eller én
        dag. Oversikten forutsetter at folk har registrert allergenene sine
        riktig under{' '}
        <Link style={{ fontWeight: 'bold' }} to="/users/me">
          innstillinger
        </Link>
        .
      </MessageBox>
      <Group justify="space-between" wrap="wrap">
        <WeekController
          week={shiftsFrom}
          previousWeekCallback={() => changeWeek(-1)}
          nextWeekCallback={() => changeWeek(1)}
        />
        {week && week.days.length > 0 && (
          <SegmentedControl
            data={dayOptions}
            value={day ?? 'week'}
            onChange={value => setDay(value === 'week' ? null : value)}
          />
        )}
      </Group>

      {error ? (
        <FullPageError error={error} />
      ) : loading && !data ? (
        <FullContentLoader />
      ) : !view || view.peopleAtWork === 0 ? (
        <MessageBox type="info">Ingen står på vakt i perioden.</MessageBox>
      ) : (
        <Stack gap="xs">
          <Text fz="sm" c="dimmed">
            {view.peopleAtWork} på vakt, {view.users.length} med allergener
          </Text>
          {view.users.length === 0 ? (
            <MessageBox type="info">
              Ingen av dem som står på vakt har registrert allergener.
            </MessageBox>
          ) : (
            <Table.ScrollContainer minWidth={240 + view.allergies.length * 96}>
              <Table
                verticalSpacing={6}
                fz="sm"
                withTableBorder
                withColumnBorders
                highlightOnHover
                stickyHeader
              >
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Navn</Table.Th>
                    {view.allergies.map(allergy => (
                      <Table.Th key={allergy} ta="center">
                        {allergy}
                      </Table.Th>
                    ))}
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {view.users.map(user => (
                    <Table.Tr key={user.userId}>
                      <Table.Td>
                        <UserCell
                          to={`/users/${user.userId}`}
                          name={user.name}
                          compact
                        />
                      </Table.Td>
                      {user.allergies.map((hasAllergy, index) => (
                        <Table.Td key={view.allergies[index]} ta="center">
                          {hasAllergy && (
                            <IconCheck
                              size={16}
                              color="var(--mantine-color-samfundet-red-6)"
                              aria-label="Ja"
                            />
                          )}
                        </Table.Td>
                      ))}
                    </Table.Tr>
                  ))}
                </Table.Tbody>
                <Table.Tfoot>
                  <Table.Tr>
                    <Table.Th>Totalt</Table.Th>
                    {view.counts.map((count, index) => (
                      <Table.Th key={view.allergies[index]} ta="center">
                        {count}
                      </Table.Th>
                    ))}
                  </Table.Tr>
                </Table.Tfoot>
              </Table>
            </Table.ScrollContainer>
          )}
        </Stack>
      )}
    </Stack>
  )
}

export default ScheduleAllergies
