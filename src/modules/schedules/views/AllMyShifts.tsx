import { useQuery } from '@apollo/client'
import { Button, Group, Stack, Title } from '@mantine/core'
import { Breadcrumbs } from 'components/Breadcrumbs'
import { FullPageError } from 'components/FullPageComponents'
import { FullContentLoader } from 'components/Loading'
import { Link } from 'react-router-dom'
import { UserShiftCardList } from '../components'
import { ALL_MY_SHIFTS } from '../queries'
import { AllMyShiftsReturns } from '../types.graphql'

const breadcrumbsItems = [
  { label: 'Hjem', path: '/dashboard' },
  { label: 'Vakter', path: '/schedules/all-shifts' },
  { label: 'Min vaktplan', path: '' },
]

export const AllMyShifts: React.FC = () => {
  const { data, loading, error } = useQuery<AllMyShiftsReturns>(ALL_MY_SHIFTS, {
    pollInterval: 30_000,
  })

  if (error) return <FullPageError />

  if (loading || !data) return <FullContentLoader />

  const { allMyShifts } = data

  return (
    <Stack>
      <Breadcrumbs items={breadcrumbsItems} />
      <Group position="apart" align="baseline" style={{ maxWidth: 900 }}>
        <Title>Alle mine vakter</Title>
        <Link to="/schedules/me">
          <Button>Mine kommende vakter</Button>
        </Link>
      </Group>
      <UserShiftCardList shifts={allMyShifts} />
    </Stack>
  )
}
