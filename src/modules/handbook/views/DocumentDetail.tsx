import { useQuery } from '@apollo/client'
import { ActionIcon, Card, Group, Stack, Title } from '@mantine/core'
import { IconEdit } from '@tabler/icons'
import { Breadcrumbs } from 'components/Breadcrumbs'
import { FullPage404, FullPageError } from 'components/FullPageComponents'
import { FullContentLoader } from 'components/Loading'
import { PermissionGate } from 'components/PermissionGate'
import { useParams } from 'react-router-dom'
import { PERMISSIONS } from 'util/permissions'
import { DOCUMENT_DETAIL_QUERY } from '../queries'
import { DocumentDetailReturn, DocumentDetailVariables } from '../types.graphql'
import { useState } from 'react'
import { DocumentForm } from '../components/DocumentForm/DocumentForm'

type DocumentDetailParams = {
  documentId: string
}

const DocumentDetail = () => {
  const { documentId } = useParams<
    keyof DocumentDetailParams
  >() as DocumentDetailParams
  const [editMode, setEditMode] = useState(false)
  const { data, loading, error } = useQuery<
    DocumentDetailReturn,
    DocumentDetailVariables
  >(DOCUMENT_DETAIL_QUERY, {
    variables: {
      id: documentId,
    },
  })

  if (error) return <FullPageError />

  if (loading || !data) return <FullContentLoader />

  const { document } = data

  if (document === null) return <FullPage404 />

  const breadcrumbs = [
    { label: 'Home', path: '/' },
    { label: 'Håndboka', path: '/handbook' },
    { label: document.name, path: '' },
  ]

  return (
    <Stack>
      <Breadcrumbs items={breadcrumbs} />

      {editMode ? (
        <DocumentForm
          document={document}
          onCompletedCallback={() => setEditMode(false)}
          editCallback={() => setEditMode(!editMode)}
        />
      ) : (
        <>
          <Group position={editMode ? 'right' : 'apart'}>
            {editMode ? null : (
              <Title order={2} color={'dimmed'}>
                {document.name}
              </Title>
            )}
            <PermissionGate permissions={PERMISSIONS.handbook.change.document}>
              <ActionIcon onClick={() => setEditMode(!editMode)}>
                <IconEdit />
              </ActionIcon>
            </PermissionGate>
          </Group>
          <Card withBorder>
            <div
              dangerouslySetInnerHTML={{
                __html: document.content,
              }}
            />
          </Card>
        </>
      )}
    </Stack>
  )
}
export default DocumentDetail
