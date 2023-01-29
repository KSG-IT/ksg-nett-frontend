import { useQuery } from '@apollo/client'
import { Stack, Title } from '@mantine/core'
import { FullPageError } from 'components/FullPageComponents'
import { FullContentLoader } from 'components/Loading'
import { ShortcutCardGrid } from 'components/ShortcutCard'
import { ALL_INTERNAL_GROUPS_BY_TYPE_QUERY } from '../queries'
import { AllInternalGroupsByTypeReturns } from '../types'

export const InternalGroups: React.FC = () => {
  const { loading, error, data } = useQuery<AllInternalGroupsByTypeReturns>(
    ALL_INTERNAL_GROUPS_BY_TYPE_QUERY
  )

  if (error) return <FullPageError />

  if (loading || !data) return <FullContentLoader />

  const internalGroups = data?.internalGroups ?? []
  const interestGroups = data?.interestGroups ?? []

  const internalGroupShortcuts = internalGroups.map(internalGroup => ({
    title: internalGroup.name,
    link: `/internal-groups/${internalGroup.id}`,
  }))
  const interestGroupShortcuts = interestGroups.map(interestGroup => ({
    title: interestGroup.name,
    link: `/internal-groups/${interestGroup.id}`,
  }))

  return (
    <Stack>
      <Title order={1}>Driftende gjenger</Title>
      <ShortcutCardGrid cols={3} shortcuts={internalGroupShortcuts} />
      <Title order={1}>Interessegrupper</Title>
      <ShortcutCardGrid cols={3} shortcuts={interestGroupShortcuts} />
    </Stack>
  )
}
