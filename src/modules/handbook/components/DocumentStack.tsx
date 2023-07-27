import {
  createStyles,
  Group,
  Paper,
  Stack,
  Text,
  useMantineTheme,
} from '@mantine/core'
import { IconFile } from '@tabler/icons-react'
import { Link, useNavigate } from 'react-router-dom'
import { DocumentNode } from '../types.graphql'
import { formatDistanceToNow } from '../../../util/date-fns'

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
  const theme = useMantineTheme()
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
    <Stack spacing={0}>
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
          <Group position="apart">
            <Group>
              <IconFile
                color={theme.colors[theme.primaryColor][6]}
                fill={theme.colors[theme.primaryColor][0]}
                stroke={1.4}
              />
              <Text
                component={Link}
                to={`document/${document.id}`}
                size={'sm'}
                color={selectedDocument?.id === document.id ? 'black' : 'dark'}
                weight={
                  selectedDocument?.id === document.id ? 'bold' : 'lighter'
                }
              >
                {document.name}
              </Text>
            </Group>
            <Group>
              <Text
                color={
                  selectedDocument?.id === document.id ? 'black' : 'dimmed'
                }
                truncate
                size={'xs'}
              >
                Oppdatert sist av: {document.updatedBy?.firstName}
              </Text>
              <Text
                color={
                  selectedDocument?.id === document.id ? 'black' : 'dimmed'
                }
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

const useStyles = createStyles(theme => ({
  card: {
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: theme.colors.gray[0],
    },
  },
  cardActive: {
    backgroundColor: theme.colors[theme.primaryColor][0],
  },
}))
