import { useQuery } from '@apollo/client'
import { Stack, Title } from '@mantine/core'
import { Breadcrumbs } from 'components/Breadcrumbs'
import { FullPageError } from 'components/FullPageComponents'
import { FullContentLoader } from 'components/Loading'
import { NewbieCards } from '../components'
import { NEWWBIES_QUERY } from '../queries'
import { NewbiesQueryReturns } from '../types'

const breadcrumbItems = [
  { label: 'Home', path: '/dashboard' },
  { label: 'Users', path: '/users' },
  { label: 'Newbies', path: '' },
]

const Newbies: React.FC = () => {
  const { data, loading, error } = useQuery<NewbiesQueryReturns>(NEWWBIES_QUERY)

  if (error) return <FullPageError />

  if (loading || !data) return <FullContentLoader />

  const { newbies } = data

  return (
    <Stack>
      <Breadcrumbs items={breadcrumbItems} />
      <Title>De nye</Title>
      <NewbieCards newbies={newbies} />
    </Stack>
  )
}

export default Newbies
