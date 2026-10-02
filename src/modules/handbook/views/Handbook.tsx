import { useQuery } from '@apollo/client'
import { ActionIcon, Button, Group, Stack, Title } from '@mantine/core'
import { useClickOutside } from '@mantine/hooks'
import { showNotification } from '@mantine/notifications'
import { IconEdit, IconEye, IconFilePlus, IconTrash } from '@tabler/icons-react'
import { Breadcrumbs } from 'components/Breadcrumbs'
import { FullPageError } from 'components/FullPageComponents'
import { FullContentLoader } from 'components/Loading'
import { PermissionGate } from 'components/PermissionGate'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { PERMISSIONS } from 'util/permissions'
import { DocumentStack } from '../components'
import { useDocumentMutations } from '../mutations.hooks'
import { ALL_DOCUMENTS_QUERY } from '../queries'
import { AllDocumentsReturn, DocumentNode } from '../types.graphql'

const breadcrumbs = [
  { label: 'Home', path: '/' },
  { label: 'Håndboka', path: '/handbook' },
]

const Handbook = () => {
  const { data, loading, error } =
    useQuery<AllDocumentsReturn>(ALL_DOCUMENTS_QUERY)
  const [selectedDocument, setSelectedDocument] = useState<Pick<
    DocumentNode,
    'id' | 'createdAt' | 'name' | 'updatedAt' | 'updatedBy'
  > | null>(null)
  const { deleteDocument, deleteDocumentLoading } = useDocumentMutations()
  const ref = useClickOutside(() => handleClickOutside())
  const navigate = useNavigate()
  if (error) return <FullPageError />

  if (loading || !data) return <FullContentLoader />

  const { allDocuments } = data

  function handleDelete(event: any, documentId: string) {
    deleteDocument({
      variables: {
        id: documentId,
      },
      refetchQueries: [ALL_DOCUMENTS_QUERY],
      onCompleted: ({ deleteDocument }) => {
        if (deleteDocument) {
          showNotification({
            title: 'Slettet',
            message: `Dokumentet ble slettet`,
            color: 'red',
          })
        }
      },
    }).then(() => setSelectedDocument(null))
  }

  function handleClickOutside() {
    setSelectedDocument(null)
  }

  return (
    <Stack ref={ref}>
      <Breadcrumbs items={breadcrumbs} />
      <Group justify="apart">
        <Title>Håndboka</Title>
        <Group>
          <PermissionGate permissions={PERMISSIONS.handbook.delete.document}>
            <ActionIcon disabled>
              <IconEye />
            </ActionIcon>
            <ActionIcon
              disabled={!selectedDocument}
              onClick={(evt: React.MouseEvent<HTMLButtonElement, MouseEvent>) =>
                selectedDocument && handleDelete(evt, selectedDocument.id)
              }
              color="gray"
            >
              <IconTrash size={24} stroke={2} />
            </ActionIcon>

            <ActionIcon
              disabled={!selectedDocument}
              onClick={() =>
                navigate(`document/${selectedDocument?.id}?mode=edit`)
              }
              color="gray"
            >
              <IconEdit size={24} stroke={2} />
            </ActionIcon>
          </PermissionGate>

          <PermissionGate permissions={PERMISSIONS.handbook.add.document}>
            <Button
              disabled={deleteDocumentLoading}
              component={Link}
              to={'create'}
              leftSection={<IconFilePlus />}
              variant="subtle"
            >
              Nytt dokument
            </Button>
          </PermissionGate>
        </Group>
      </Group>

      <DocumentStack
        selectedCallback={document => setSelectedDocument(document)}
        selectedDocument={selectedDocument}
        documents={allDocuments}
      />
    </Stack>
  )
}

export default Handbook
