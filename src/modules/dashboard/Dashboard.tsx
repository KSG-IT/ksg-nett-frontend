import { useQuery } from '@apollo/client'
import { FullPageError } from 'components/FullPageComponents'
import { FullContentLoader } from 'components/Loading'
import { createStyles, Grid, Group, Stack } from '@mantine/core'
import { useStore } from 'store'
import { ShortcutCards } from './components/ShortcutCards'
import { FutureShifts } from './components/FutureShifts'
import { RecentQuotes } from './components/QuotesGrid'
import { TransactionCard } from './components/TransactionCard'
import { WantedList } from './components/WantedList'
import { DASHBOARD_DATA_QUERY } from './queries'
import { DashboardDataQueryReturns } from './types'

const useStyles = createStyles(theme => ({
  wrapper: {
    width: '100%',
    maxWidth: '1300px',
  },
}))

// TODO: Replace mockData with actual shift data query
const mockData = [
  {
    user: { id: '1', firstName: 'Seb' },
    slot: {
      start: '19.00',
      end: '01.00',
      type: { name: 'Barservitør' },
      group: { name: 'gruppe 1' },
    },
  },
  {
    user: { id: '2', firstName: 'Seb' },
    slot: {
      start: '20.00',
      end: '00.00',
      type: { name: 'Bartender' },
      group: { name: 'gruppe 2' },
    },
  },
]

export const Dashboard = () => {
  const { classes } = useStyles()
  const user = useStore(state => state.user)!

  const { data, loading, error } =
    useQuery<DashboardDataQueryReturns>(DASHBOARD_DATA_QUERY)

  if (error) return <FullPageError />

  if (loading || data === undefined) return <FullContentLoader />

  const {
    dashboardData: { wantedList, lastSummaries, lastQuotes },
  } = data

  return (
    <Stack spacing={'md'} justify={'flex-start'} className={classes.wrapper}>
      <ShortcutCards />
      {wantedList.length >= 1 && <WantedList users={wantedList} />}
      <Grid justify={'space-between'}>
        <Grid.Col sm={8} lg={5}>
          <FutureShifts shifts={mockData} />
        </Grid.Col>
        <Grid.Col sm={8} lg={5}>
          <TransactionCard user={user} />
        </Grid.Col>
      </Grid>
      <Group>
        <RecentQuotes quotes={lastQuotes} />
      </Group>
    </Stack>
  )
}
