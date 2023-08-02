import { useQuery } from '@apollo/client'
import {
  Card,
  createStyles,
  Grid,
  keyframes,
  Stack,
  Text,
  Title,
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
import { useNavigate } from 'react-router-dom'

const breadCrumbItems = [{ label: 'Hjem', path: '/dashboard' }]

export const Dashboard = () => {
  const { classes } = useStyles()
  const theme = useMantineTheme()
  const navigate = useNavigate()
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
    },
  } = data

  function handlePinnedThreadClick() {
    navigate('/forum/ksg-it-har-opptak')
  }

  return (
    <Stack spacing="md" justify={'flex-start'} className={classes.wrapper}>
      <Breadcrumbs items={breadCrumbItems} />

      <Text weight={700} color="dimmed">
        Fremhevet tråd
      </Text>
      <Card
        className={classes.pinnedThreadCard}
        onClick={handlePinnedThreadClick}
      >
        <Title order={3}>KSG-IT har opptak!</Title>
        Trykk her for å lese mer
      </Card>

      <ShortcutCards
        sociOrderSession={!!sociOrderSession}
        showNewbies={showNewbies}
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
  pinnedThreadCard: {
    marginBottom: theme.spacing.md,
    ':hover': {
      cursor: 'pointer',
      backgroundColor: theme.colors.gray[0],
    },
    // Animated border rainbow
    backgroundImage: `linear-gradient(
      to right,
      ${theme.colors.red[5]},
      ${theme.colors.orange[5]},
      ${theme.colors.yellow[5]},
      ${theme.colors.green[5]},
      ${theme.colors.teal[5]},
      ${theme.colors.cyan[5]},
      ${theme.colors.blue[5]},
      ${theme.colors.indigo[5]},
      ${theme.colors.violet[5]}
    )`,
    backgroundSize: '200% 100%',
    backgroundPosition: 'left bottom',
    animation: `${bounce} 3s ease-in-out infinite`,
    '@keyframes gradient': {
      '0%': { backgroundPosition: 'left bottom' },
      '100%': { backgroundPosition: 'right bottom' },
    },
  },
}))
