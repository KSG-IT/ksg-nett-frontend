import {
  ActionIcon,
  Badge,
  Group,
  Menu,
  Paper,
  Stack,
  useMantineTheme,
} from '@mantine/core'
import { IconDots, IconFile, IconTrash } from '@tabler/icons'
import { PermissionGate } from 'components/PermissionGate'
import { Link } from 'react-router-dom'
import { PERMISSIONS } from 'util/permissions'
import { DocumentNode } from '../types.graphql'

interface DocumentStackProps {
  documents: Pick<DocumentNode, 'id' | 'createdAt' | 'name' | 'updatedAt'>[]
}

export const DocumentStack: React.FC<DocumentStackProps> = ({ documents }) => {
  const theme = useMantineTheme()

  return (
    <Stack spacing={0}>
      {documents.map(document => (
        <Paper
          component={Link}
          to={`document/${document.id}`}
          withBorder
          key={document.id}
          p="xs"
        >
          <Group position="apart">
            <Group>
              <IconFile
                color={theme.colors.gray[5]}
                fill={theme.colors.gray[5]}
              />
              <Badge size={'xl'} variant={'filled'} radius={'sm'}>
                {document.name}
              </Badge>
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
