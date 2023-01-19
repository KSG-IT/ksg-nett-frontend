import { useQuery } from '@apollo/client'
import { Button, Group, Stack, Title } from '@mantine/core'
import { IconFilePlus } from '@tabler/icons'
import { Breadcrumbs } from 'components/Breadcrumbs'
import { FullPageError } from 'components/FullPageComponents'
import { FullContentLoader } from 'components/Loading'
import { PermissionGate } from 'components/PermissionGate'
import { PERMISSIONS } from 'util/permissions'
import { DocumentStack } from '../components'
import { ALL_DOCUMENTS_QUERY } from '../queries'
import { AllDocumentsReturn } from '../types.graphql'

const breadcrumbs = [
  { label: 'Home', path: '/' },
  { label: 'Håndboka', path: '/handbook' },
]

const Handbook = () => {
  const { data, loading, error } =
    useQuery<AllDocumentsReturn>(ALL_DOCUMENTS_QUERY)

  if (error) return <FullPageError />

  if (loading || !data) return <FullContentLoader />

  const { allDocuments } = data

  return (
    <Stack>
      <Breadcrumbs items={breadcrumbs} />
      {/* Meta data card here eventually */}
      <Group position="apart">
        <Title>Håndboka</Title>

        <PermissionGate permissions={PERMISSIONS.handbook.add.document}>
          <Button disabled leftIcon={<IconFilePlus />} variant="subtle">
            Nytt dokument
          </Button>
        </PermissionGate>
      </Group>

      <DocumentStack documents={allDocuments} />
    </Stack>
  )
}

export default Handbook
