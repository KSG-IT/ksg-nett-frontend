import { ActionIcon, Menu } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import {
  IconCheck,
  IconChecks,
  IconDots,
  IconEditCircle,
  IconTrash,
  IconX,
} from '@tabler/icons'
import { CardTable } from 'components/CardTable'
import { FullContentLoader } from 'components/Loading'
import { PermissionGate } from 'components/PermissionGate'
import { useDepositMutations } from 'modules/economy/mutations.hooks'
import { ALL_DEPOSITS } from 'modules/economy/queries'
import { DepositNode } from 'modules/economy/types.graphql'
import { UserThumbnail } from 'modules/users/components'
import { ME_QUERY } from 'modules/users/queries'
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
    <tr key={deposit.id}>
      <td>{format(new Date(deposit.createdAt), 'yyyy.MM.dd HH:mm')}</td>
      <td>{deposit.account.user.fullName}</td>
      <td>{deposit.amount}</td>
      <td>{deposit.description}</td>
      <td>
        {deposit.approvedBy ? (
          <UserThumbnail user={deposit.approvedBy} />
        ) : null}
      </td>
      <td>
        <PermissionGate permissions={PERMISSIONS.economy.approve.deposit}>
          <Menu position="left-start">
            <Menu.Target>
              <ActionIcon>
                <IconDots size={16} stroke={1.5} />
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item
                icon={<IconCheck />}
                color="green"
                onClick={() => handleApproveDeposit(deposit)}
              >
                Godkjenn
              </Menu.Item>
              <Menu.Item
                icon={<IconEditCircle />}
                color="orange"
                onClick={() => handleApproveDeposit(deposit, true)}
              >
                Korrriger og godkjenn
              </Menu.Item>
              <Menu.Item
                icon={<IconX />}
                color="purple"
                disabled={!deposit.approved}
                onClick={() => handleInvalidateDeposit(deposit)}
              >
                Underkjenn
              </Menu.Item>
              <Menu.Item
                color="red"
                icon={<IconTrash />}
                disabled={deposit.approved}
                onClick={() => handleDeleteDeposit(deposit)}
              >
                Slett
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </PermissionGate>
      </td>
    </tr>
  ))

  return (
    <CardTable compact>
      <thead>
        <tr>
          <th>Tidsstempel</th>
          <th>Navn</th>
          <th>Sum</th>
          <th>Kommentar</th>
          <th>Godkjent av</th>
          <th></th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </CardTable>
  )
}
