import { ActionIcon, Badge, Button, Menu } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { IconBan, IconDots, IconEye } from '@tabler/icons'
import { CardTable } from 'components/CardTable'
import { useSociSessionMutations } from 'modules/economy/mutations.hooks'
import { ALL_SOCI_SESSIONS } from 'modules/economy/queries'
import { SociSessionNode, SociSessionType } from 'modules/economy/types.graphql'
import { getSoiSeccionTypeColor } from 'modules/economy/utils'
import { Link } from 'react-router-dom'
import { format } from 'util/date-fns'
import { useCurrencyFormatter } from 'util/hooks'
import { numberWithSpaces } from 'util/parsing'

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

    console.log('close')
  }

  const rows = sociSessions.map(sociSession => (
    <tr key={sociSession.id}>
      <td>
        <Link to={`${sociSession.id}`}>{sociSession.getNameDisplay}</Link>
      </td>
      <td>{format(new Date(sociSession.createdAt), 'yyyy.MM.dd')}</td>
      <td>
        <Badge color={getSoiSeccionTypeColor(sociSession.type)}>
          {sociSession.type}
        </Badge>
      </td>
      <td>{formatCurrency(sociSession.minimumRemainingBalance)}</td>
      <td>
        <Badge>{sociSession.closed ? 'Stengt' : 'Åpen'}</Badge>
      </td>
      <td>{formatCurrency(sociSession.moneySpent)}</td>
      <td>
        <Menu transition={'pop'} withArrow position="bottom-end" withinPortal>
          <Menu.Target>
            <ActionIcon>
              <IconDots size="1rem" stroke={1.5} />
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item icon={<IconEye size="1rem" stroke={1.5} />} color="blue">
              <Link to={`${sociSession.id}`}>Mer info</Link>
            </Menu.Item>
            <Menu.Item
              icon={<IconBan size="1rem" stroke={1.5} />}
              color="red"
              onClick={() => {
                handleCloseSociSession(sociSession.id)
              }}
            >
              Steng liste
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </td>
    </tr>
  ))

  return (
    <CardTable compact>
      <thead>
        <tr>
          <th>Navn</th>
          <th>Opprettet</th>
          <th>Type</th>
          <th>Beløpsgrense</th>
          <th>Status</th>
          <th>Forbruk</th>
          <th></th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </CardTable>
  )
}
