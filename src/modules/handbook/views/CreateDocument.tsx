import { Stack, Title } from '@mantine/core'
import { Breadcrumbs } from 'components/Breadcrumbs'
import { DocumentForm } from '../components/DocumentForm/DocumentForm'

const breadcrumbItems = [
  { label: 'Hjem', path: '/dashboard' },
  { label: 'Håndboka', path: '/handbook' },
  { label: 'Opprett', path: '/handbook/create' },
]

export const CreateDocument: React.FC = () => {
  return (
    <Stack spacing="sm">
      <Breadcrumbs items={breadcrumbItems} />
      <Title order={2}>Opprett nytt dokument</Title>
      <DocumentForm onCompletedCallback={() => null} />
    </Stack>
  )
}
