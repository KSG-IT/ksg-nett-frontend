import { Button } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
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
      <td>
        <a href={deposit.receipt || ''} target="_blank">
          Se kvittering
        </a>
      </td>
      <td>
        {deposit.approvedBy ? (
          <UserThumbnail user={deposit.approvedBy} />
        ) : null}
      </td>
      <td>
        {deposit.approved ? (
          <Button onClick={() => handleDeposit(deposit)} color="samfundet-red">
            Underkjenn
          </Button>
        ) : (
          <Button onClick={() => handleDeposit(deposit)} color="samfundet-red">
            Godkjenn
          </Button>
        )}
      </td>
    </tr>
  ))

  return (
    <CardTable>
      <thead>
        <tr>
          <th>Tidsstempel</th>
          <th>Navn</th>
          <th>Sum</th>
          <th>Kvittering</th>
          <th>Godkjent av</th>
          <th>Handling</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </CardTable>
  )
}
