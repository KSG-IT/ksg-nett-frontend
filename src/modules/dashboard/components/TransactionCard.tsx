import { Anchor, Group, Paper, Stack, Text, ThemeIcon } from '@mantine/core'
import {
  IconArrowsLeftRight,
  IconPigMoney,
  IconShoppingCart,
} from '@tabler/icons-react'
import {
  ActivityKind,
  activityKind,
  activityTime,
  formatAmount,
  signedAmount,
} from 'modules/economy/transactions'
import { Link } from 'react-router-dom'
import { BankAccountActivity } from '../../economy/types.graphql'
import classes from 'modules/economy/components/ActivityList.module.css'

interface TransactionCardProps {
  activities: BankAccountActivity[]
  showEconomyLink?: boolean
}

export const TransactionCard: React.FC<TransactionCardProps> = ({
  activities,
  showEconomyLink = false,
}) => (
  <Stack gap="xs">
    <Group justify="space-between">
      <Text c="dimmed" fw={700}>
        Siste transaksjoner
      </Text>
      {showEconomyLink && (
        <Anchor component={Link} to="/economy/me" size="sm">
          Min økonomi
        </Anchor>
      )}
    </Group>
    <Paper withBorder radius="md" className={classes.card}>
      {activities.length === 0 ? (
        <Text c="dimmed" size="sm" ta="center" p="md">
          Du har ingen transaksjoner ennå.
        </Text>
      ) : (
        <TransactionRows activities={activities} />
      )}
    </Paper>
  </Stack>
)

interface TransactionRowsProps {
  activities: BankAccountActivity[]
}

const TransactionRows: React.FC<TransactionRowsProps> = ({ activities }) => {
  const now = new Date()
  return (
    <>
      {activities.map((activity, index) => (
        <TransactionRow
          key={`${activity.timestamp}-${index}`}
          activity={activity}
          now={now}
        />
      ))}
    </>
  )
}

const KIND_ICON: Record<
  ActivityKind,
  { icon: React.ReactNode; color: string }
> = {
  purchase: { icon: <IconShoppingCart size={16} />, color: 'gray' },
  deposit: { icon: <IconPigMoney size={16} />, color: 'green' },
  transfer: { icon: <IconArrowsLeftRight size={16} />, color: 'blue' },
}

interface TransactionRowProps {
  activity: BankAccountActivity
  now: Date
}

const TransactionRow: React.FC<TransactionRowProps> = ({ activity, now }) => {
  const { icon, color } = KIND_ICON[activityKind(activity)]
  const amount = signedAmount(activity)
  const quantity = activity.quantity > 1 ? ` · ${activity.quantity} stk` : ''

  return (
    <div className={classes.row}>
      <ThemeIcon variant="light" color={color} radius="xl" size={32}>
        {icon}
      </ThemeIcon>
      <div className={classes.text}>
        <Text size="sm" fw={600} truncate>
          {activity.name}
          {quantity && (
            <Text span size="sm" c="dimmed" fw={400}>
              {quantity}
            </Text>
          )}
        </Text>
        <Text size="xs" c="dimmed">
          {activityTime(new Date(activity.timestamp), now)}
        </Text>
      </div>
      <Text
        size="sm"
        fw={700}
        className={classes.amount}
        c={amount > 0 ? 'green.8' : undefined}
      >
        {formatAmount(amount)}
      </Text>
    </div>
  )
}
