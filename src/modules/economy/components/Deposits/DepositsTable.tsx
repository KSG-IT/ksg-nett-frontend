import { Button, createStyles, Image, Modal, Paper, Table } from '@mantine/core'
import { CardTable } from 'components/CardTable'
import { FullContentLoader } from 'components/Loading'
import { useDepositMutations } from 'modules/economy/mutations.hooks'
import { ALL_DEPOSITS } from 'modules/economy/queries'
import { DepositNode } from 'modules/economy/types.graphql'
import { UserThumbnail } from 'modules/users/components'
import { ME_QUERY } from 'modules/users/queries'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { format } from 'util/date-fns'

interface DepositsTableProps {
  deposits: DepositNode[]
  queryLoading: boolean
}

export const DepositsTable: React.FC<DepositsTableProps> = ({
  deposits,
  queryLoading,
}) => {
  const { classes } = useDepositsTableStyles()
  const [previewModalOpen, setPreviewModalOpen] = useState(false)
  const [previewImageIndex, setPreviewImageIndex] = useState<number | null>(
    null
  )

  const { approveDeposit, invalidateDeposit } = useDepositMutations()

  if (queryLoading) return <FullContentLoader />

  function handlePreviewImage(index: number) {
    setPreviewImageIndex(index)
    setPreviewModalOpen(true)
  }

  function getPreviewImage(): string {
    if (previewImageIndex === null) return ''

    const receipt = deposits[previewImageIndex]?.receipt
    if (receipt === null || receipt === undefined) return ''

    return receipt
  }

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
      onError() {
        toast.error('Noe gikk galt')
      },
      onCompleted() {
        toast.success(message)
      },
    })
  }

  const rows = deposits.map((deposit, index) => (
    <tr key={deposit.id}>
      <td>{format(new Date(deposit.createdAt), 'yyyy.MM.dd HH:mm')}</td>
      <td>{deposit.account.user.fullName}</td>
      <td>{deposit.amount}</td>
      <td>
        <Button
          variant="subtle"
          color="samfundet-red"
          onClick={() => handlePreviewImage(index)}
        >
          Se kvittering
        </Button>
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
    <>
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
      <Modal
        fullScreen
        title="Kvittering"
        opened={previewModalOpen}
        onClose={() => setPreviewModalOpen(false)}
      >
        {previewImageIndex !== null && (
          <Image className={classes.previewImage} src={getPreviewImage()} />
        )}
      </Modal>
    </>
  )
}

const useDepositsTableStyles = createStyles(theme => ({
  previewImage: {
    width: '100%',
    height: '100%',
  },
  paper: {
    overflowX: 'scroll',
  },
}))
