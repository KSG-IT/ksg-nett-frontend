import { useQuery } from '@apollo/client'
import { createStyles, Title } from '@mantine/core'
import { DatePicker } from '@mantine/dates'
import { Breadcrumbs } from 'components/Breadcrumbs'
import { FullPageError } from 'components/FullPageComponents'
import { FullContentLoader } from 'components/Loading'
import { format } from 'date-fns'
import { useState } from 'react'
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

  const { data, error, loading } = useQuery<
    AllShiftsReturns,
    AllShiftsVariables
  >(ALL_SHIFTS, { variables: { date: format(date, 'yyyy-MM-dd') } })

  if (error) return <FullPageError />

  if (loading || !data) return <FullContentLoader />

  const { allShifts } = data

  return (
    <div className={classes.wrapper}>
      <Breadcrumbs items={breadcrumbsItems} />
      <Title>Hva skjer'a?</Title>
      <DatePicker value={date} onChange={val => val && setDate(val)} />

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
