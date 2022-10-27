import { useQuery } from '@apollo/client'
import { FullPageError } from 'components/FullPageComponents'
import { FullContentLoader } from 'components/Loading'
import {
  Anchor,
  createStyles,
  Grid,
  Group,
  SimpleGrid,
  Stack,
  useMantineTheme,
} from '@mantine/core'
import { useStore } from 'store'
import { ShortcutCards } from './components/ShortcutCards'
import { FutureShifts } from './components/FutureShifts'
import { RecentQuotes } from './components/RecentQuotes'
import { TransactionCard } from './components/TransactionCard'
import { WantedList } from './components/WantedList'
import { DASHBOARD_DATA_QUERY } from './queries'
import { DashboardDataQueryReturns } from './types.graphql'
import { useMediaQuery } from 'util/hooks'
import { Breadcrumbs } from 'components/Breadcrumbs'

const breadCrumbItems = [{ label: 'Hjem', path: '/dashboard' }]

export const Dashboard = () => {
  const { classes } = useStyles()
  const theme = useMantineTheme()
  const mediaQuery = useMediaQuery(
    `(min-width: ${theme.breakpoints.xl + 300}px)`
  )
  const user = useStore(state => state.user)!

  const { data, loading, error } =
    useQuery<DashboardDataQueryReturns>(DASHBOARD_DATA_QUERY)

  if (error) return <FullPageError />

  if (loading || data === undefined) return <FullContentLoader />

  const {
    dashboardData: { wantedList, lastQuotes, myUpcomingShifts },
  } = data

  return (
    <Stack spacing="md" justify={'flex-start'} className={classes.wrapper}>
      <Breadcrumbs items={breadCrumbItems} />
      <ShortcutCards />
      {wantedList.length >= 1 && <WantedList users={wantedList} />}
      <Grid justify={'space-between'}>
        <Grid.Col sm={6} lg={mediaQuery ? 5 : 6}>
          <FutureShifts shifts={myUpcomingShifts} />
          <TransactionCard user={user} />
        </Grid.Col>
        <Grid.Col sm={6} lg={mediaQuery ? 5 : 6}>
          <RecentQuotes quotes={lastQuotes} />
        </Grid.Col>
      </Grid>
    </Stack>
  )
}

const useStyles = createStyles(theme => ({
  wrapper: {
    width: '100%',
    maxWidth: '1600px',
    padding: theme.spacing.md,

    [`@media (max-width: ${theme.breakpoints.xl}px)`]: {
      padding: 0,
    },
  },
}))
