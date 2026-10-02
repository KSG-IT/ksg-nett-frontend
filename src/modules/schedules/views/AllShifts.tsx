import { useQuery } from '@apollo/client'
import { Title } from '@mantine/core'
import { DatePickerInput } from '@mantine/dates'
import { createStyles } from '@mantine/emotion'
import { Breadcrumbs } from 'components/Breadcrumbs'
import { FullPageError } from 'components/FullPageComponents'
import { FullContentLoader } from 'components/Loading'
import { format } from 'date-fns'
import queryString from 'query-string'
import { useEffect, useRef, useState } from 'react'
import { UserShiftCardList } from '../components'
import { ALL_SHIFTS } from '../queries'
import { AllShiftsReturns, AllShiftsVariables } from '../types.graphql'

const breadcrumbsItems = [
  { label: 'Hjem', path: '/dashboard' },
  { label: 'Vakter', path: '/schedules/all-shifts' },
]

export const AllShifts = () => {
  const [date, setDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'))
  const { classes } = useAllShiftsStyles()
  const firstRender = useRef(true)

  const { data, error, loading } = useQuery<
    AllShiftsReturns,
    AllShiftsVariables
  >(ALL_SHIFTS, {
    variables: { date: date },
    pollInterval: 30_000,
  })

  useEffect(() => {
    // Check if there is a date in the query string. If not use today's date and update the query string
    if (!firstRender.current) return
    firstRender.current = false

    const search = queryString.parse(location.search)
    const dateString = search.date as string

    if (dateString) {
      setDate(dateString)
    } else {
      const today = format(new Date(), 'yyyy-MM-dd')
      setDate(today)
      history.pushState({}, '', `${location.pathname}?date=${today}`)
    }
  }, [setDate])

  if (error) return <FullPageError />

  if (loading || !data) return <FullContentLoader />

  const { allShifts } = data

  function handleDateChange(date: string) {
    setDate(date)
    history.pushState({}, '', `/schedules/all-shifts?date=${date}`)
  }

  return (
    <div className={classes.wrapper}>
      <Breadcrumbs items={breadcrumbsItems} />
      <Title>Hva skjer'a?</Title>
      <DatePickerInput
        value={date}
        onChange={val => val && handleDateChange(val)}
      />

      <UserShiftCardList shifts={allShifts} />
    </div>
  )
}

const useAllShiftsStyles = createStyles({
  wrapper: {
    display: 'flex',
    width: '100%',
    flexDirection: 'column',
    gap: 'var(--mantine-spacing-md)',
  },
})
