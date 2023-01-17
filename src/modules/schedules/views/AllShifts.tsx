import { useQuery } from '@apollo/client'
import { createStyles, Title } from '@mantine/core'
import { DatePicker } from '@mantine/dates'
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
  const [date, setDate] = useState<Date>(new Date())
  const { classes } = useAllShiftsStyles()
  const firstRender = useRef(true)

  const { data, error, loading } = useQuery<
    AllShiftsReturns,
    AllShiftsVariables
  >(ALL_SHIFTS, {
    variables: { date: format(date, 'yyyy-MM-dd') },
    pollInterval: 30_000,
  })

  useEffect(() => {
    // Check if there is a date in the query string. If not use today's date and update the query string
    if (!firstRender.current) return
    firstRender.current = false

    console.log(location.search)

    const search = queryString.parse(location.search)
    const dateString = search.date as string

    if (dateString) {
      const date = new Date(dateString)
      setDate(date)
    } else {
      setDate(new Date())
      history.pushState(
        {},
        '',
        `${location.pathname}?date=${format(new Date(), 'yyyy-MM-dd')}`
      )
    }
  }, [setDate])

  if (error) return <FullPageError />

  if (loading || !data) return <FullContentLoader />

  const { allShifts } = data

  function handleDateChange(date: Date) {
    setDate(date)
    history.pushState(
      {},
      '',
      `/schedules/all-shifts?date=${format(date, 'yyyy-MM-dd')}`
    )
  }

  return (
    <div className={classes.wrapper}>
      <Breadcrumbs items={breadcrumbsItems} />
      <Title>Hva skjer'a?</Title>
      <DatePicker value={date} onChange={val => val && handleDateChange(val)} />

      <UserShiftCardList shifts={allShifts} />
    </div>
  )
}

const useAllShiftsStyles = createStyles(theme => ({
  wrapper: {
    display: 'flex',
    width: '100%',
    flexDirection: 'column',
    gap: theme.spacing.md,
  },
}))
