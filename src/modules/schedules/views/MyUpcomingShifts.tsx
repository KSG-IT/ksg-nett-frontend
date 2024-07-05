import { useQuery } from '@apollo/client'
import { Button, Group, Stack, Title } from '@mantine/core'
import { Breadcrumbs } from 'components/Breadcrumbs'
import { FullPageError } from 'components/FullPageComponents'
import { FullContentLoader } from 'components/Loading'
import { MessageBox } from 'components/MessageBox'
import { Link } from 'react-router-dom'
import { useStore } from 'store'
import { API_URL } from 'util/env'
import { UserShiftCardList } from '../components'
import { MY_UPCOMING_SHIFTS } from '../queries'
import { MyUpcomingShiftsReturns } from '../types.graphql'
import { createStyles } from '@mantine/emotion'

const breadcrumbsItems = [
  { label: 'Hjem', path: '/dashboard' },
  { label: 'Vakter', path: '/schedules/all-shifts' },
  { label: 'Min vaktplan', path: '' },
]
export const MyUpcomingShifts: React.FC = () => {
  const me = useStore(state => state.user)
  const { classes } = useMyUpcomingShiftStyles()

  const { data, loading, error } = useQuery<MyUpcomingShiftsReturns>(
    MY_UPCOMING_SHIFTS,
    { pollInterval: 30_000 }
  )

  if (error) return <FullPageError />

  if (loading || !data) return <FullContentLoader />

  const { myUpcomingShifts } = data

  return (
    <Stack className={classes.container} spacing="xs">
      <Breadcrumbs items={breadcrumbsItems} />
      <Group position="apart" align="baseline">
        <Title>Mine kommende vakter</Title>
        <Link to="history">
          <Button>Alle mine vakter</Button>
        </Link>
      </Group>

      <MessageBox type="info">
        Arbeidskalenderen din er også tilgjengelig i iCal format gjennom
        nettadressen{' '}
        <b className={classes.icalUrl}>
          {API_URL}/schedules/{me.icalToken}
        </b>
        .
      </MessageBox>

      <UserShiftCardList shifts={myUpcomingShifts} />
    </Stack>
  )
}

const useMyUpcomingShiftStyles = createStyles(theme => ({
  container: {
    maxWidth: 900,
  },
  icalUrl: {
    wordBreak: 'break-word',
  },
}))
