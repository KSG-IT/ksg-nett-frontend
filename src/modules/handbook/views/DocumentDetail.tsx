import { useQuery } from '@apollo/client'
import { Button, Card, Group, Stack, Title } from '@mantine/core'
import { Breadcrumbs } from 'components/Breadcrumbs'
import { FullPage404, FullPageError } from 'components/FullPageComponents'
import { FullContentLoader } from 'components/Loading'
import { PermissionGate } from 'components/PermissionGate'
import { Link, useParams } from 'react-router-dom'
import { PERMISSIONS } from 'util/permissions'
import { DOCUMENT_DETAIL_QUERY } from '../queries'
import { DocumentDetailReturn, DocumentDetailVariables } from '../types.graphql'
import { useEffect, useRef, useState } from 'react'
import { DocumentForm } from '../components/DocumentForm/DocumentForm'
import queryString from 'query-string'

type DocumentDetailParams = {
  documentId: string
}

interface DocumentDetailProps {
  editModeInitial?: boolean
}

const DocumentDetail: React.FC<DocumentDetailProps> = ({ editModeInitial }) => {
  const { documentId } = useParams<
    keyof DocumentDetailParams
  >() as DocumentDetailParams
  const [editMode, setEditMode] = useState(editModeInitial || false)
  const firstRender = useRef(true)
  const { data, loading, error } = useQuery<
    DocumentDetailReturn,
    DocumentDetailVariables
  >(DOCUMENT_DETAIL_QUERY, {
    variables: {
      id: documentId,
    },
  })

  useEffect(() => {
    if (!firstRender.current) return
    firstRender.current = false

    const search = queryString.parse(location.search)
    const modeString = search.mode as string

    if (modeString === 'edit') {
      setEditMode(true)
    }
  }, [setEditMode])

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
            <Group>
              <Button variant={'outline'} component={Link} to={'/handbook'}>
                Tilbake
              </Button>
              <PermissionGate
                permissions={PERMISSIONS.handbook.change.document}
              >
                <Button
                  variant={'light'}
                  onClick={() => setEditMode(!editMode)}
                >
                  {editMode ? 'Avbryt' : 'Rediger'}
                </Button>
              </PermissionGate>
            </Group>
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
