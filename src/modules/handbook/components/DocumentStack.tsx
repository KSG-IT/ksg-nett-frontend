import {
  ActionIcon,
  createStyles,
  Group,
  Menu,
  Paper,
  Stack,
  Title,
  useMantineTheme,
} from '@mantine/core'
import { IconDots, IconFile, IconTrash } from '@tabler/icons'
import { PermissionGate } from 'components/PermissionGate'
import { useNavigate } from 'react-router-dom'
import { PERMISSIONS } from 'util/permissions'
import { DocumentNode } from '../types.graphql'

interface DocumentStackProps {
  documents: Pick<DocumentNode, 'id' | 'createdAt' | 'name' | 'updatedAt'>[]
}

export const DocumentStack: React.FC<DocumentStackProps> = ({ documents }) => {
  const { classes } = useStyles()
  const theme = useMantineTheme()
  const navigate = useNavigate()

  function handleNavigate(documentId: string) {
    navigate(`/handbook/document/${documentId}`)
  }

  return (
    <Stack spacing={0}>
      {documents.map(document => (
        <Paper withBorder key={document.id} p="xs">
          <Group position="apart">
            <Group
              className={classes.documentGroup}
              role="link"
              onClick={() => handleNavigate(document.id)}
            >
              <IconFile
                color={theme.colors.gray[5]}
                fill={theme.colors.gray[5]}
              />
              <Title order={4}>{document.name}</Title>
            </Group>
            <PermissionGate permissions={PERMISSIONS.handbook.delete.document}>
              <td>
                <Menu
                  transition="pop"
                  withArrow
                  position="bottom-end"
                  zIndex={300}
                >
                  <Menu.Target>
                    <ActionIcon>
                      <IconDots size={16} stroke={1.5} />
                    </ActionIcon>
                  </Menu.Target>
                  <Menu.Dropdown>
                    <Menu.Item
                      icon={<IconTrash size={16} stroke={1.5} />}
                      color="red"
                    >
                      Slett dokument
                    </Menu.Item>
                  </Menu.Dropdown>
                </Menu>
              </td>
            </PermissionGate>
          </Group>
        </Paper>
      ))}
    </Stack>
  )
}

const useStyles = createStyles(theme => ({
  documentGroup: {
    paddingRight: theme.spacing.xl,
    ':hover': {
      cursor: 'pointer',
      textDecoration: 'underline',
    },
  },
}))
