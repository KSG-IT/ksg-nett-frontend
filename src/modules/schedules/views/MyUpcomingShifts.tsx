import { useQuery } from '@apollo/client'
import { Button, Group, Title } from '@mantine/core'
import { FullPageError } from 'components/FullPageComponents'
import { FullContentLoader } from 'components/Loading'
import { Link } from 'react-router-dom'
import { UserShiftCardList } from '../components'
import { MY_UPCOMING_SHIFTS } from '../queries'
import { MyUpcomingShiftsReturns } from '../types.graphql'

export const MyUpcomingShifts: React.FC = () => {
  const { data, loading, error } =
    useQuery<MyUpcomingShiftsReturns>(MY_UPCOMING_SHIFTS)

  if (error) return <FullPageError />

  if (loading || !data) return <FullContentLoader />

  const { myUpcomingShifts } = data

  return (
    <>
      <Group position="apart" align="baseline" style={{ maxWidth: 900 }}>
        <Title>Mine vakter</Title>
        <Link to="history">
          <Button>Alle mine vakter</Button>
        </Link>
      </Group>
      <UserShiftCardList shifts={myUpcomingShifts} />
    </>
  )
}
