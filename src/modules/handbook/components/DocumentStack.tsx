import { Group, Paper, Stack, Text } from '@mantine/core'
import { IconFile } from '@tabler/icons-react'
import { Link, useNavigate } from 'react-router-dom'
import { DocumentNode } from '../types.graphql'
import { formatDistanceToNow } from '../../../util/date-fns'
import { createStyles } from '@mantine/emotion'

interface DocumentStackProps {
  documents: Pick<
    DocumentNode,
    'id' | 'createdAt' | 'name' | 'updatedAt' | 'updatedBy'
  >[]
  selectedCallback: (
    document: Pick<
      DocumentNode,
      'id' | 'createdAt' | 'name' | 'updatedAt' | 'updatedBy'
    > | null
  ) => void
  selectedDocument: Pick<
    DocumentNode,
    'id' | 'createdAt' | 'name' | 'updatedAt' | 'updatedBy'
  > | null
}

export const DocumentStack: React.FC<DocumentStackProps> = ({
  documents,
  selectedCallback,
  selectedDocument,
}) => {
  const { classes } = useStyles()
  const navigate = useNavigate()

  function handleSingleClick(
    document: Pick<
      DocumentNode,
      'id' | 'createdAt' | 'name' | 'updatedAt' | 'updatedBy'
    >
  ) {
    // If the document is already selected, deselect it
    if (selectedDocument?.id === document.id) {
      selectedCallback(null)
      return
    }
    selectedCallback(document)
  }

  return (
    <Stack gap={0}>
      {documents.map(document => (
        <Paper
          className={
            selectedDocument?.id === document.id
              ? classes.cardActive
              : classes.card
          }
          onClick={() => handleSingleClick(document)}
          onDoubleClick={() => navigate(`document/${document.id}`)}
          withBorder
          key={document.id}
          p="xs"
        >
          <Group justify="space-between">
            <Group>
              <IconFile
                color="var(--mantine-color-samfundet-red-6)"
                fill="var(--mantine-color-samfundet-red-0)"
                stroke={1.4}
              />
              <Text
                component={Link}
                to={`document/${document.id}`}
                size={'sm'}
                c={selectedDocument?.id === document.id ? 'black' : 'dark'}
                fw={selectedDocument?.id === document.id ? 'bold' : 'lighter'}
              >
                {document.name}
              </Text>
            </Group>
            <Group>
              <Text
                c={selectedDocument?.id === document.id ? 'black' : 'dimmed'}
                truncate
                size={'xs'}
              >
                Oppdatert sist av: {document.updatedBy?.firstName}
              </Text>
              <Text
                c={selectedDocument?.id === document.id ? 'black' : 'dimmed'}
                size={'xs'}
              >
                for {formatDistanceToNow(new Date(document.updatedAt))} siden
              </Text>
            </Group>
          </Group>
        </Paper>
      ))}
    </Stack>
  )
}

const useStyles = createStyles({
  card: {
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: 'var(--mantine-color-gray-0)',
    },
  },
  cardActive: {
    backgroundColor: 'var(--mantine-color-samfundet-red-0)',
  },
})
