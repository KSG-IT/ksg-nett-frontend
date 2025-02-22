import { Popover, Stack } from '@mantine/core'
import {
  addDays,
  endOfMonth,
  endOfWeek,
  getWeeksInMonth,
  startOfMonth,
  startOfWeek,
} from 'date-fns'
import { useState } from 'react'
import { format } from 'util/date-fns'
import { useMonth } from 'util/hooks'
import { useGetShiftInterestsByRosterId } from '../queries.hooks'
import { InterestChoices } from '../types'

/**
 *
 * 1. Fetch roster (99% cases will only be a single roster for a user, if multiple allow user to select)
 *  1a) this can be bootstrapped on UserNode: user.rosters
 * 2.
 */

/**
 *
 * @param date date of the month in question
 * @returns An array of date arrays. The top level array item is eacg
 * week of the input date month, inclusive of dates outside of the month
 * as long as a single date of the input month is in this week
 */
function weeksOfMonth(date: Date) {
  const weeksOfMonth = getWeeksInMonth(date)
  const startOfMonthDate = startOfMonth(date)
  const endOfMonthDate = endOfMonth(date)

  const dateOfFirstWeek = startOfWeek(startOfMonthDate, { weekStartsOn: 1 })
  const dateOfLastWeek = endOfWeek(endOfMonthDate, { weekStartsOn: 1 })

  const weeks: Date[][] = []

  for (let week = 0; week < weeksOfMonth; week++) {
    let tracker: Date[] = []
    for (let day = 0; day < 7; day++) {
      const dayOffset = day + week * 7

      tracker.push(addDays(dateOfFirstWeek, dayOffset))
    }

    weeks.push(tracker)
  }

  return {
    dateList: weeks,
    dateOfFirstWeek,
    dateOfLastWeek,
  }
}

const RosterChoices = [
  {
    value: 'Edgar',
    label: 'Edgar',
  },
  // {
  //   value: 'Edgar',
  //   label: 'Edgar',
  // },
]

export const MyAvailability = () => {
  const [selectedRoster, setSelectedRoster] = useState(RosterChoices[0])

  if (!selectedRoster)
    return (
      <span>
        Uffda, du må være en del av en vaktplan for å legge inn ønske. Ta
        kontakt med vaktlisteansvarlig i din gjeng
      </span>
    )
  return (
    <div>
      <div>Vatkplan: {selectedRoster.label}</div>
      {RosterChoices.length > 1 && <select></select>}
      <Calendar initialMonth={new Date()} rosterId={selectedRoster.value} />
    </div>
  )
}

type CalendarProps = {
  initialMonth: Date
  rosterId: string
}

const DateShifts = ({
  shifts,
}: {
  shifts: {
    id: number
    location: string
    timeDisplay: string
    name?: string
    interest: InterestChoices
  }[]
}) => {
  return (
    <div style={{ width: '100%' }}>
      {shifts.map(item => (
        <Popover position="right">
          <Popover.Target>
            <div
              key={item.id}
              style={{
                backgroundColor: getStatusColor(item.interest),
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer',
                fontSize: 12,
                marginBottom: 2,
                padding: 1,
              }}
            >
              <span>{item.location}</span>
              <span>{item.timeDisplay}</span>
            </div>
          </Popover.Target>
          <Popover.Dropdown>
            <span>{item?.name}</span>
            <Stack spacing={0}>
              <button>Vil jobbe</button>
              <button>Kan jobbe</button>
              <button>Kan ikke jobbe</button>
            </Stack>
          </Popover.Dropdown>
        </Popover>
      ))}
    </div>
  )
}

const Calendar = ({ initialMonth, rosterId }: CalendarProps) => {
  const { month, incrementMonth, decrementMonth } = useMonth(initialMonth)
  const {
    dateList: data,
    dateOfFirstWeek,
    dateOfLastWeek,
  } = weeksOfMonth(month)

  const shiftInterestMap = useGetShiftInterestsByRosterId({
    rosterId,
    fromDate: dateOfFirstWeek,
    toDate: dateOfLastWeek,
  })

  // Should only return shifts in which this user is usually autofilled as.
  // As a barista i should not get KA shifts in here
  return (
    <div>
      <button onClick={decrementMonth}>-</button>
      <button onClick={incrementMonth}>+</button>
      <h1>{format(month, 'LLLL YYY')}</h1>
      <div
        style={{
          display: 'grid',
          gap: 0,
          gridTemplateColumns: 'repeat(7, 1fr)',
          columnGap: 0,
          flexDirection: 'column',
          backgroundColor: 'white',
        }}
      >
        {data.map(weekList => (
          <>
            {weekList.map(day => {
              const dayKey = format(day, 'YYY-M-d')
              const shifts = shiftInterestMap[dayKey]

              return (
                <div
                  style={{
                    width: '100%',
                    minHeight: 120,
                    height: '100%',
                    border: '1px solid black',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                    }}
                  >
                    <span>{format(day, 'EE')}</span>
                    <span>{format(day, 'd')}</span>
                    {shifts && <DateShifts shifts={shifts} />}
                  </div>
                </div>
              )
            })}
          </>
        ))}
      </div>
    </div>
  )
}

function getStatusColor(interestType: InterestChoices) {
  if (interestType === InterestChoices.CAN_WORK) {
    return 'yellow'
  }

  if (interestType === InterestChoices.WANT_TO_WORK) {
    return 'green'
  }
  if (interestType === InterestChoices.CANNOT_WORK) {
    return 'red'
  }
}
