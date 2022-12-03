import { useQuery } from '@apollo/client'
import { SimpleGrid, Stack, Title } from '@mantine/core'
import { FullPageError } from 'components/FullPageComponents'
import { FullContentLoader } from 'components/Loading'
import { InternalGroupCard } from '../components/InternalGroupCard'
import { ALL_INTERNAL_GROUPS_BY_TYPE_QUERY } from '../queries'
import { AllInternalGroupsByTypeReturns, InternalGroupNode } from '../types'

export const InternalGroups: React.FC = () => {
  const { loading, error, data } = useQuery<AllInternalGroupsByTypeReturns>(
    ALL_INTERNAL_GROUPS_BY_TYPE_QUERY
  )

  if (error) return <FullPageError />
  if (loading || !data) return <FullContentLoader />

  const internalGroups = data?.internalGroups
  const interestGroups = data?.interestGroups

  return (
    <Stack>
      <Title order={1}>Driftende gjenger</Title>
      <SimpleGrid cols={2}>
        {internalGroups.map((group: InternalGroupNode) => (
          <InternalGroupCard key={group.id} internalGroup={group} />
        ))}
      </SimpleGrid>
      <Title order={1}>Interessegrupper</Title>
      <SimpleGrid cols={2}>
        {interestGroups.map((group: InternalGroupNode) => (
          <InternalGroupCard key={group.id} internalGroup={group} />
        ))}
      </SimpleGrid>
    </Stack>
  )
}
