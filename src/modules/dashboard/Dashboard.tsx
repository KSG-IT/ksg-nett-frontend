import { useQuery } from '@apollo/client'
import {
  createStyles,
  Grid,
  keyframes,
  Stack,
  useMantineTheme,
} from '@mantine/core'
import { Breadcrumbs } from 'components/Breadcrumbs'
import { FullPageError } from 'components/FullPageComponents'
import { FullContentLoader } from 'components/Loading'
import { useStore } from 'store'
import { useMediaQuery } from 'util/hooks'
import { FutureShifts } from './components/FutureShifts'
import { RecentQuotes } from './components/RecentQuotes'
import { ShortcutCards } from './components/ShortcutCards'
import { TransactionCard } from './components/TransactionCard'
import { WantedList } from './components/WantedList'
import { DASHBOARD_DATA_QUERY } from './queries'
import { DashboardDataQueryReturns } from './types.graphql'

const breadCrumbItems = [{ label: 'Hjem', path: '/dashboard' }]

export const Dashboard = () => {
  const { classes } = useStyles()
  const theme = useMantineTheme()
  const mediaQuery = useMediaQuery(
    `(min-width: ${theme.breakpoints.xl + 300}px)`
  )
  const user = useStore(state => state.user)!

  const { data, loading, error } = useQuery<DashboardDataQueryReturns>(
    DASHBOARD_DATA_QUERY,
    {
      pollInterval: 10_000,
    }
  )

  if (error) return <FullPageError />

  if (loading || data === undefined) return <FullContentLoader />

  const {
    dashboardData: {
      wantedList,
      lastQuotes,
      myUpcomingShifts,
      sociOrderSession,
      showNewbies,
      showStockMarketShortcut,
    },
  } = data

  return (
    <Stack spacing="md" justify={'flex-start'} className={classes.wrapper}>
      <Breadcrumbs items={breadCrumbItems} />

      <ShortcutCards
        sociOrderSession={!!sociOrderSession}
        showNewbies={showNewbies}
        showStockMarketShortcut={showStockMarketShortcut}
      />
      {wantedList.length >= 1 && <WantedList users={wantedList} />}
      <Grid justify={'space-between'}>
        <Grid.Col sm={6} lg={mediaQuery ? 5 : 6}>
          <FutureShifts shifts={myUpcomingShifts} />
          <TransactionCard activities={user.lastTransactions} />
        </Grid.Col>
        <Grid.Col sm={6} lg={mediaQuery ? 5 : 6}>
          <RecentQuotes quotes={lastQuotes} />
        </Grid.Col>
      </Grid>
    </Stack>
  )
}

const bounce = keyframes({
  'from, 20%, 53%, 80%, to': { transform: 'translate3d(0, 0, 0)' },
  '40%, 43%': { transform: 'translate3d(0, -1.875rem, 0)' },
  '70%': { transform: 'translate3d(0, -0.9375rem, 0)' },
  '90%': { transform: 'translate3d(0, -0.25rem, 0)' },
})

const useStyles = createStyles(theme => ({
  wrapper: {
    width: '100%',
    maxWidth: '1600px',

    [`@media (max-width: ${theme.breakpoints.xl}px)`]: {
      padding: 0,
    },
  },
}))
