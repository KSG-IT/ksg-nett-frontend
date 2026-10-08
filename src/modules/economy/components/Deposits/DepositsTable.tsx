import { ActionIcon, Menu, Table } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import {
  IconCheck,
  IconDots,
  IconEditCircle,
  IconTrash,
  IconX,
} from '@tabler/icons-react'
import { CardTable } from 'components/CardTable'
import { FullContentLoader } from 'components/Loading'
import { PermissionGate } from 'components/PermissionGate'
import { useDepositMutations } from 'modules/economy/mutations.hooks'
import { ALL_DEPOSITS } from 'modules/economy/queries'
import { DepositNode } from 'modules/economy/types.graphql'
import { UserThumbnail } from 'modules/users/components'
import { ME_QUERY } from 'modules/users/queries'
import { Link } from 'react-router-dom'
import { format } from 'util/date-fns'
import { PERMISSIONS } from 'util/permissions'

interface DepositsTableProps {
  deposits: DepositNode[]
  queryLoading: boolean
}

export const DepositsTable: React.FC<DepositsTableProps> = ({
  deposits,
  queryLoading,
}) => {
  const { approveDeposit, invalidateDeposit, deleteDeposit } =
    useDepositMutations()

  if (queryLoading) return <FullContentLoader />

  function handleApproveDeposit(deposit: DepositNode, correct = false) {
    let mutationVariables = {
      depositId: deposit.id,
      correctedAmount: deposit.amount,
    }

    if (correct) {
      const correctedAmouynt = prompt('Korrekt beløp?', `${deposit.amount}`)

      if (correctedAmouynt === null) return

      const amount = parseInt(correctedAmouynt)

      if (isNaN(amount)) {
        showNotification({
          title: 'Noe gikk galt',
          message: 'Beløpet må være et tall',
        })
        return
      }

      mutationVariables = {
        ...mutationVariables,
        correctedAmount: amount,
      }
    }

    approveDeposit({
      variables: {
        ...mutationVariables,
      },

      refetchQueries: [ALL_DEPOSITS, ME_QUERY],
      onCompleted() {
        showNotification({
          title: 'Suksess',
          color: 'teal',
          message: 'Innskudd er godkjent',
        })
      },
      onError({ message }) {
        showNotification({
          title: 'Noe gikk galt',
          message,
        })
      },
    })
  }

  function handleDeleteDeposit(deposit: DepositNode) {
    deleteDeposit({
      variables: {
        id: deposit.id,
      },
      refetchQueries: [ALL_DEPOSITS, ME_QUERY],
      onCompleted() {
        showNotification({
          title: 'Suksess',
          color: 'teal',
          message: 'Innskudd er slettet',
        })
      },
      onError({ message }) {
        showNotification({
          title: 'Noe gikk galt',
          message,
        })
      },
    })
  }

  function handleInvalidateDeposit(deposit: DepositNode) {
    if (!deposit.approved) {
      showNotification({
        title: 'Noe gikk galt',
        message: 'Kan ikke underkjenne et innskudd som ikke er godkjent',
      })
      return
    }

    invalidateDeposit({
      variables: {
        depositId: deposit.id,
      },
      refetchQueries: [ALL_DEPOSITS, ME_QUERY],
      onCompleted() {
        showNotification({
          title: 'Suksess',
          color: 'teal',
          message: 'Innskudd er underkjent',
        })
      },
      onError({ message }) {
        showNotification({
          title: 'Noe gikk galt',
          message,
        })
      },
    })
  }

  const rows = deposits.map((deposit, index) => (
    <Table.Tr key={deposit.id}>
      <Table.Td>
        {format(new Date(deposit.createdAt), 'yyyy.MM.dd HH:mm')}
      </Table.Td>
      <Table.Td>
        <Link to={`/users/${deposit.account.user.id}`}>
          {deposit.account.user.fullName}
        </Link>
      </Table.Td>
      <Table.Td>{deposit.amount}</Table.Td>
      <Table.Td>{deposit.description}</Table.Td>
      <Table.Td>
        {deposit.approvedBy ? (
          <UserThumbnail user={deposit.approvedBy} />
        ) : null}
      </Table.Td>
      <Table.Td>
        <PermissionGate permissions={PERMISSIONS.economy.approve.deposit}>
          <Menu position="left-start">
            <Menu.Target>
              <ActionIcon>
                <IconDots size={16} stroke={1.5} />
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item
                leftSection={<IconCheck />}
                color="green"
                disabled={deposit.approved}
                onClick={() => handleApproveDeposit(deposit)}
              >
                Godkjenn
              </Menu.Item>
              <Menu.Item
                leftSection={<IconEditCircle />}
                color="orange"
                disabled={deposit.approved}
                onClick={() => handleApproveDeposit(deposit, true)}
              >
                Korrriger og godkjenn
              </Menu.Item>
              <Menu.Item
                leftSection={<IconX />}
                color="purple"
                disabled={!deposit.approved}
                onClick={() => handleInvalidateDeposit(deposit)}
              >
                Underkjenn
              </Menu.Item>
              <Menu.Item
                color="red"
                leftSection={<IconTrash />}
                disabled={deposit.approved}
                onClick={() => handleDeleteDeposit(deposit)}
              >
                Slett
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </PermissionGate>
      </Table.Td>
    </Table.Tr>
  ))

  return (
    <CardTable compact>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Tidsstempel</Table.Th>
          <Table.Th>Navn</Table.Th>
          <Table.Th>Sum</Table.Th>
          <Table.Th>Kommentar</Table.Th>
          <Table.Th>Godkjent av</Table.Th>
          <Table.Th></Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>{rows}</Table.Tbody>
    </CardTable>
  )
}
