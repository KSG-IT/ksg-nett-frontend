import { useQuery } from '@apollo/client'
import { Card, Stack, Switch, Table, Title } from '@mantine/core'
import { Breadcrumbs } from 'components/Breadcrumbs'
import { FullPageError } from 'components/FullPageComponents'
import { FullContentLoader } from 'components/Loading'
import { useFeatureFlagMutations } from '../mutations.hooks'
import { ALL_FEATURE_FLAGS } from '../queries'
import { AllFeatureFlagsQuery } from '../types.graphql'

const FeatureFlags = () => {
  const { data, loading, error } =
    useQuery<AllFeatureFlagsQuery>(ALL_FEATURE_FLAGS)

  const { toggleFeatureFlag } = useFeatureFlagMutations()

  if (error) return <FullPageError />

  if (loading || !data) return <FullContentLoader />

  const { allFeatureFlags } = data

  function handleToggleFeatureFlag(id: string) {
    toggleFeatureFlag({
      variables: {
        featureFlagId: id,
      },
      refetchQueries: [ALL_FEATURE_FLAGS],
    })
  }

  return (
    <Stack>
      <Breadcrumbs
        items={[
          { label: 'Hjem', path: '/dashboard' },
          { label: 'Feature flags', path: '/feature-flags' },
        ]}
      />
      <Title>Feature flags</Title>
      <Card p="sm">
        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Navn</Table.Th>
              <Table.Th>Beskrivelse</Table.Th>
              <Table.Th>Aktivert</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {allFeatureFlags.map(flag => (
              <Table.Tr key={flag.id}>
                <Table.Td>{flag.name}</Table.Td>

                <Table.Td>{flag.description}</Table.Td>
                <Table.Td>
                  <Switch
                    style={{ cursor: 'crosshair' }}
                    checked={flag.enabled}
                    onClick={() => handleToggleFeatureFlag(flag.id)}
                  />
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Card>
    </Stack>
  )
}

export default FeatureFlags
