import {
  Button,
  Card,
  Group,
  Stack,
  Table,
  TextInput,
  Title,
} from '@mantine/core'
import { createStyles } from '@mantine/emotion'
import {
  IconEye,
  IconMessage2,
  IconPlus,
  IconSearch,
} from '@tabler/icons-react'
import { Breadcrumbs } from 'components/Breadcrumbs'
import { CardTable } from 'components/CardTable'
import { PermissionGate } from 'components/PermissionGate'
import { useNavigate } from 'react-router-dom'
import { formatDistanceToNow } from 'util/date-fns'
import { PERMISSIONS } from 'util/permissions'

const ForumDashboard: React.FC = () => {
  const { classes } = useStyles()
  const navigate = useNavigate()
  return (
    <Stack>
      <Breadcrumbs
        items={[
          { label: 'Hjem', path: '/dashboard' },
          { label: 'Forum', path: '' },
        ]}
      />
      <Title>Forum</Title>
      <Card>
        <Group justify="space-between">
          <TextInput
            className={classes.searchInput}
            leftSection={<IconSearch />}
            placeholder="Søk i forumet"
          />
          <PermissionGate permissions={PERMISSIONS.forum.add.thread}>
            <Button leftSection={<IconPlus />}>Ny tråd</Button>
          </PermissionGate>
        </Group>
      </Card>
      <CardTable highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Tittel</Table.Th>
            <Table.Th>Forfatter</Table.Th>
            <Table.Th>Lagt ut</Table.Th>
            <Table.Th>
              <IconMessage2 />
            </Table.Th>
            <Table.Th>
              <IconEye />
            </Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          <Table.Tr
            className={classes.tableRow}
            onClick={() => navigate('ksg-it-har-opptak')}
          >
            <Table.Td>KSG-IT har opptak!</Table.Td>
            <Table.Td>Alexander "Bøtte²" Orvik</Table.Td>
            <Table.Td>{formatDistanceToNow(new Date())}</Table.Td>
            <Table.Td>93</Table.Td>
            <Table.Td>417</Table.Td>
          </Table.Tr>
        </Table.Tbody>
      </CardTable>
    </Stack>
  )
}

const useStyles = createStyles(() => ({
  searchInput: {
    flex: 1,
  },
  tableRow: {
    cursor: 'pointer',
  },
}))

export default ForumDashboard
