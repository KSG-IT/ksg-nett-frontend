import { useQuery } from '@apollo/client'
import { Button, createStyles, Group, Stack, Title } from '@mantine/core'
import { Breadcrumbs } from 'components/Breadcrumbs'
import { FullPageError } from 'components/FullPageComponents'
import { FullContentLoader } from 'components/Loading'
import { Link } from 'react-router-dom'
import { UserShiftCardList } from '../components'
import { MY_UPCOMING_SHIFTS } from '../queries'
import { MyUpcomingShiftsReturns } from '../types.graphql'

const breadcrumbsItems = [
  { label: 'Hjem', path: '/dashboard' },
  { label: 'Vakter', path: '/schedules/all-shifts' },
  { label: 'Min vaktplan', path: '' },
]
export const MyUpcomingShifts: React.FC = () => {
  const { classes } = useMyUpcomingShiftStyles()

  const { data, loading, error } =
    useQuery<MyUpcomingShiftsReturns>(MY_UPCOMING_SHIFTS)

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
      <UserShiftCardList shifts={myUpcomingShifts} />
    </Stack>
  )
}

const useMyUpcomingShiftStyles = createStyles(theme => ({
  container: {
    maxWidth: 900,
  },
}))
