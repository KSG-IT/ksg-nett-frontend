import { ActionIcon, Button } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { IconCheck, IconX } from '@tabler/icons'
import { CardTable } from 'components/CardTable'
import { FullContentLoader } from 'components/Loading'
import { useDepositMutations } from 'modules/economy/mutations.hooks'
import { ALL_DEPOSITS } from 'modules/economy/queries'
import { DepositNode } from 'modules/economy/types.graphql'
import { UserThumbnail } from 'modules/users/components'
import { ME_QUERY } from 'modules/users/queries'
import { format } from 'util/date-fns'

interface DepositsTableProps {
  deposits: DepositNode[]
  queryLoading: boolean
}

export const DepositsTable: React.FC<DepositsTableProps> = ({
  deposits,
  queryLoading,
}) => {
  const { approveDeposit, invalidateDeposit } = useDepositMutations()

  if (queryLoading) return <FullContentLoader />

  function handleDeposit(deposit: DepositNode) {
    const handler = deposit.approved ? invalidateDeposit : approveDeposit

    const message = deposit.approved
      ? 'Innskudd underkjent'
      : 'Innskudd godkjent'

    handler({
      variables: {
        depositId: deposit.id,
      },
      refetchQueries: [ALL_DEPOSITS, ME_QUERY],
      onCompleted() {
        showNotification({
          title: 'Suksess',
          color: 'teal',
          message,
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
        {deposit.approved ? (
          <ActionIcon
            onClick={() => handleDeposit(deposit)}
            color="samfundet-red"
          >
            <IconX />
          </ActionIcon>
        ) : (
          <ActionIcon
            onClick={() => handleDeposit(deposit)}
            color="samfundet-red"
          >
            <IconCheck />
          </ActionIcon>
        )}
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
          <th>Handling</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </CardTable>
  )
}
