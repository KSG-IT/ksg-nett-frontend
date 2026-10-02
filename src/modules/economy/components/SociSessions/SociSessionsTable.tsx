import { ActionIcon, Menu, Table } from '@mantine/core'
import { Badge } from 'components/Badge'
import { showNotification } from '@mantine/notifications'
import { IconBan, IconDots, IconEye } from '@tabler/icons-react'
import { CardTable } from 'components/CardTable'
import { useSociSessionMutations } from 'modules/economy/mutations.hooks'
import { ALL_SOCI_SESSIONS } from 'modules/economy/queries'
import { SociSessionNode, SociSessionType } from 'modules/economy/types.graphql'
import { getSoiSeccionTypeColor } from 'modules/economy/utils'
import { Link } from 'react-router-dom'
import { format } from 'util/date-fns'
import { useCurrencyFormatter } from 'util/hooks'

interface SociSessionsTableProps {
  sociSessions: SociSessionNode[]
}

export const SociSessionsTable: React.FC<SociSessionsTableProps> = ({
  sociSessions,
}) => {
  const { formatCurrency } = useCurrencyFormatter()
  const { closeSociSession } = useSociSessionMutations()

  function handleCloseSociSession(sociSessionId: string) {
    const actionConfirmed = confirm('Er du sikker på at du vil stenge listen?')
    if (!actionConfirmed) return

    closeSociSession({
      variables: {
        id: sociSessionId,
      },
      refetchQueries: [ALL_SOCI_SESSIONS],
      onError({ message }) {
        showNotification({
          title: 'Noe gikk galt',
          message,
        })
      },
      onCompleted() {
        showNotification({
          title: 'Suksess',
          message: 'Liste stengt',
        })
      },
    })
  }

  const rows = sociSessions.map(sociSession => (
    <Table.Tr key={sociSession.id}>
      <Table.Td>
        <Link to={`${sociSession.id}`}>{sociSession.getNameDisplay}</Link>
      </Table.Td>
      <Table.Td>
        {format(new Date(sociSession.createdAt), 'yyyy.MM.dd')}
      </Table.Td>
      <Table.Td>
        <Badge color={getSoiSeccionTypeColor(sociSession.type)}>
          {sociSession.type}
        </Badge>
      </Table.Td>
      <Table.Td>{formatCurrency(sociSession.minimumRemainingBalance)}</Table.Td>
      <Table.Td>{formatCurrency(sociSession.moneySpent)}</Table.Td>
      <Table.Td>
        <Badge>{sociSession.closed ? 'Stengt' : 'Åpen'}</Badge>
      </Table.Td>
      <Table.Td>
        <Menu
          transitionProps={{ transition: 'pop' }}
          withArrow
          position="bottom-end"
          withinPortal
        >
          <Menu.Target>
            <ActionIcon>
              <IconDots size="1rem" stroke={1.5} />
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item
              leftSection={<IconEye size="1rem" stroke={1.5} />}
              color="blue"
            >
              <Link to={`${sociSession.id}`}>Mer info</Link>
            </Menu.Item>
            <Menu.Item
              leftSection={<IconBan size="1rem" stroke={1.5} />}
              color="red"
              disabled={
                sociSession.type === SociSessionType.SOCIETETEN ||
                sociSession.closed
              }
              onClick={() => {
                handleCloseSociSession(sociSession.id)
              }}
            >
              Steng liste
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Table.Td>
    </Table.Tr>
  ))

  return (
    <CardTable compact>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Navn</Table.Th>
          <Table.Th>Opprettet</Table.Th>
          <Table.Th>Type</Table.Th>
          <Table.Th>Beløpsgrense</Table.Th>
          <Table.Th>Forbruk</Table.Th>
          <Table.Th>Status</Table.Th>
          <Table.Th></Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>{rows}</Table.Tbody>
    </CardTable>
  )
}
