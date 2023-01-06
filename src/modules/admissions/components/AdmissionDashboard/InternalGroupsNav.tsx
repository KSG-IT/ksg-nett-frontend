import { useQuery } from '@apollo/client'
import { Box, Group, Paper, Text, Title } from '@mantine/core'
import { FullContentLoader } from 'components/Loading'
import { ShortcutCardGrid } from 'components/ShortcutCard'
import { INTERNAL_GROUPS_ACCEPTING_APPLICANTS } from 'modules/admissions/queries'
import { InternalGroupsAcceptingApplicantsReturns } from 'modules/admissions/types.graphql'

export const InternalGroupsNav: React.FC = () => {
  const { error, loading, data } =
    useQuery<InternalGroupsAcceptingApplicantsReturns>(
      INTERNAL_GROUPS_ACCEPTING_APPLICANTS
    )

  if (error) return null

  if (loading || !data) return <FullContentLoader />

  const { internalGroupsAcceptingApplicants } = data

  const internalGroupShortcuts = internalGroupsAcceptingApplicants.map(
    internalGroup => ({
      title: internalGroup.name,
      link: `/admissions/internal-group/${internalGroup.id}`,
      color: 'samfundet-red',
    })
  )

  return (
    <>
      <Title order={2}>Gjenger som har eksternopptak</Title>
      <ShortcutCardGrid shortcuts={internalGroupShortcuts} />
    </>
  )
}
