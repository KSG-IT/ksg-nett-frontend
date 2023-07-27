import { useQuery } from '@apollo/client'
import {
  Card,
  Group,
  Stack,
  Switch,
  Table,
  Text,
  Title,
  Tooltip,
} from '@mantine/core'
import { IconInfoCircle } from '@tabler/icons-react'
import { Breadcrumbs } from 'components/Breadcrumbs'
import { CardTable } from 'components/CardTable'
import { FullPageError } from 'components/FullPageComponents'
import { FullContentLoader } from 'components/Loading'
import { MessageBox } from 'components/MessageBox'
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
          <thead>
            <tr>
              <th>Navn</th>
              <th>Beskrivelse</th>
              <th>Aktivert</th>
            </tr>
          </thead>
          <tbody>
            {allFeatureFlags.map(flag => (
              <tr key={flag.id}>
                <td>{flag.name}</td>

                <td>{flag.description}</td>
                <td>
                  <Switch
                    checked={flag.enabled}
                    onClick={() => handleToggleFeatureFlag(flag.id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>
    </Stack>
  )
}

export default FeatureFlags
