import { gql, useQuery } from '@apollo/client'
import { Stack, Title } from '@mantine/core'
import { Breadcrumbs } from 'components/Breadcrumbs'
import { FullPageError } from 'components/FullPageComponents'
import { FullContentLoader } from 'components/Loading'
import { NewbieCards } from '../components'
import { UserNode } from '../types'

const breadcrumbItems = [
  { label: 'Home', path: '/dashboard' },
  { label: 'Users', path: '/users' },
  { label: 'Newbies', path: '' },
]

const NEWWBIES_QUERY = gql`
  query NewbiesQuery {
    newbies {
      id
      fullName
      profileImage
      activeInternalGroupPosition {
        id
        name
      }
    }
  }
`

interface NewbiesQueryReturns {
  newbies: Pick<
    UserNode,
    'id' | 'fullName' | 'activeInternalGroupPosition' | 'profileImage'
  >[]
}

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
