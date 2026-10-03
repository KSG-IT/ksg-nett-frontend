import {
  ActionIcon,
  Anchor,
  Group,
  Paper,
  Stack,
  Text,
  ThemeIcon,
} from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { IconClock, IconPigMoney, IconTrash } from '@tabler/icons-react'
import { Badge } from 'components/Badge'
import { Link } from 'react-router-dom'
import { useDepositMutations } from '../mutations.hooks'
import { MY_BANK_ACCOUNT_QUERY } from '../queries'
import {
  activityTime,
  depositAmounts,
  formatAmount,
  formatKroner,
} from '../transactions'
import { DepositNode } from '../types.graphql'
import classes from './ActivityList.module.css'

interface MyDepositsProps {
  deposits: DepositNode[]
}

export const MyDeposits: React.FC<MyDepositsProps> = ({ deposits }) => (
  <Stack gap="xs">
    <Group justify="space-between">
      <Text c="dimmed" fw={700}>
        Innskudd
      </Text>
      <Anchor component={Link} to="/economy/deposits/create" size="sm">
        Nytt innskudd
      </Anchor>
    </Group>
    <Paper withBorder radius="md" className={classes.card}>
      {deposits.length === 0 ? (
        <Text c="dimmed" size="sm" ta="center" p="md">
          Du har ingen innskudd ennå.
        </Text>
      ) : (
        <DepositRows deposits={deposits} />
      )}
    </Paper>
  </Stack>
)

interface DepositRowsProps {
  deposits: DepositNode[]
}

const DepositRows: React.FC<DepositRowsProps> = ({ deposits }) => {
  const now = new Date()
  return (
    <>
      {deposits.map(deposit => (
        <DepositRow key={deposit.id} deposit={deposit} now={now} />
      ))}
    </>
  )
}

interface DepositRowProps {
  deposit: DepositNode
  now: Date
}

const DepositRow: React.FC<DepositRowProps> = ({ deposit, now }) => {
  const { deleteDeposit } = useDepositMutations()
  const { credited, paid } = depositAmounts(deposit)
  const time = activityTime(new Date(deposit.createdAt), now)

  function handleDelete() {
    if (!confirm('Er du sikker på at du vil slette dette innskuddet?')) return
    deleteDeposit({
      variables: { id: deposit.id },
      refetchQueries: [MY_BANK_ACCOUNT_QUERY],
      onCompleted() {
        showNotification({
          title: 'Suksess',
          message: 'Innskuddet ble slettet',
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

  return (
    <div className={classes.row}>
      <ThemeIcon
        variant="light"
        color={deposit.approved ? 'green' : 'orange'}
        radius="xl"
        size={32}
      >
        {deposit.approved ? (
          <IconPigMoney size={16} />
        ) : (
          <IconClock size={16} />
        )}
      </ThemeIcon>
      <div className={classes.text}>
        <Group gap={6} wrap="nowrap">
          <Text size="sm" fw={600}>
            Innskudd
          </Text>
          {!deposit.approved && (
            <Badge size="xs" variant="light" color="orange">
              Venter
            </Badge>
          )}
        </Group>
        <Text size="xs" c="dimmed">
          {time}
          {paid !== null && ` · Betalt ${formatKroner(paid)}`}
        </Text>
      </div>
      <Group gap={4} wrap="nowrap">
        <Text
          size="sm"
          fw={700}
          className={classes.amount}
          c={deposit.approved ? 'green.8' : 'dimmed'}
        >
          {formatAmount(credited)}
        </Text>
        {!deposit.approved && (
          <ActionIcon
            variant="subtle"
            color="gray"
            aria-label="Slett innskuddet"
            onClick={handleDelete}
          >
            <IconTrash size={16} />
          </ActionIcon>
        )}
      </Group>
    </div>
  )
}
