import { createStyles, Popover, Stack } from '@mantine/core'
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
  const { classes } = useShiftSlotStyles()

  if (!shifts) return null

  return (
    <div className={classes.container}>
      {shifts.map(item => (
        <Popover position="right" withArrow>
          <Popover.Target>
            <div
              className={
                item.interest === InterestChoices.CANNOT_WORK
                  ? classes.shiftUnavailable
                  : item.interest === InterestChoices.CAN_WORK
                  ? classes.shiftAvailable
                  : classes.shiftWantsToWork
              }
              key={item.id}
            >
              <span>{item.location}</span>
              <span>{item.timeDisplay}</span>
            </div>
          </Popover.Target>
          <Popover.Dropdown className={classes.popoverContainer}>
            <Stack spacing={0}>
              <span>{item?.name}</span>
              <span>{item.location}</span>
              <span>{item.timeDisplay}</span>
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

const useShiftSlotStyles = createStyles(theme => ({
  container: {
    width: '100%',
    color: 'white',
  },
  popoverContainer: {
    fontSize: 12,
    padding: 6,
    color: 'black',
    backgroundColor: '#E9EEF6',
  },
  shiftAvailable: {
    backgroundColor: theme.colors.yellow[6],
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    cursor: 'pointer',
    borderRadius: 5,
    fontSize: 13,
    marginBottom: 2,
    padding: 4,
    fontWeight: 600,
  },
  shiftWantsToWork: {
    backgroundColor: theme.colors.green[5],
    width: '100%',
    display: 'flex',
    borderRadius: 5,
    flexDirection: 'column',
    cursor: 'pointer',
    fontSize: 13,
    marginBottom: 2,
    padding: 4,
    fontWeight: 600,
  },
  shiftUnavailable: {
    backgroundColor: theme.colors.red[6],
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    borderRadius: 5,
    cursor: 'pointer',
    fontSize: 13,
    marginBottom: 2,
    padding: 4,
    fontWeight: 600,
  },
}))

const Calendar = ({ initialMonth, rosterId }: CalendarProps) => {
  const { month, incrementMonth, decrementMonth } = useMonth(initialMonth)
  const { classes } = useCalendarStyles()
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
          gap: 2,
          backgroundColor: '#E9EEF6',
          padding: 1,
          gridTemplateColumns: 'repeat(7, 1fr)',
          columnGap: 0,
          flexDirection: 'column',
        }}
      >
        <div>Mandag</div>
        <div>Tirsdag</div>
        <div>Onsdag</div>
        <div>Torsdag</div>
        <div>Fredag</div>
        <div>Lørdag</div>
        <div>Søndag</div>
        {data.map(weekList => (
          <>
            {weekList.map(day => {
              const dayKey = format(day, 'YYY-M-d')
              const shifts = shiftInterestMap[dayKey]

              return (
                <div
                  style={{
                    width: '100%',
                    backgroundColor: 'white',
                    minHeight: 200,
                    height: '100%',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      padding: '2px 4px',
                      gap: 2,
                    }}
                  >
                    <div className={classes.calendarDayMarker}>
                      {format(day, 'd')}
                    </div>
                    <DateShifts shifts={shifts} />
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

const useCalendarStyles = createStyles(theme => ({
  calendarDayMarker: {
    borderRadius: 100,
    // backgroundColor: theme.colors.red[5],
    fontSize: 12,
    // color: 'white',
    // fontWeight: 600,
    width: 20,
    height: 20,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  calendarDayContainer: {},
  shiftAvailable: {},
  shiftWantsToWork: {},
  shiftUnavailable: {},
}))
