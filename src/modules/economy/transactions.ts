// Display logic for BankAccountActivity rows (lastTransactions). The API
// gives deposits and transfers with a sign, but a purchase as a positive
// cost (ksg-nett-backend/economy/utils.py).
import { differenceInCalendarDays, format, getYear } from 'date-fns'
import { nb } from 'date-fns/locale'
import { BankAccountActivity, DepositNode } from './types.graphql'

export type ActivityKind = 'purchase' | 'deposit' | 'transfer'

// The names come from parse_deposit and parse_transfer in the backend.
export function activityKind(activity: BankAccountActivity): ActivityKind {
  if (activity.name === 'Innskudd') return 'deposit'
  if (activity.name === 'Overføring') return 'transfer'
  return 'purchase'
}

export function signedAmount(activity: BankAccountActivity) {
  return activityKind(activity) === 'purchase'
    ? -activity.amount
    : activity.amount
}

const NBSP = ' '

export function formatKroner(amount: number) {
  const digits = Math.abs(amount)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, NBSP)
  return `${digits}${NBSP}kr`
}

export function formatAmount(amount: number) {
  const sign = amount > 0 ? '+' : amount < 0 ? '−' : ''
  return `${sign}${formatKroner(amount)}`
}

export function activityTime(timestamp: Date, now: Date) {
  const days = differenceInCalendarDays(now, timestamp)
  const time = format(timestamp, 'HH:mm', { locale: nb })
  if (days === 0) return `I dag ${time}`
  if (days === 1) return `I går ${time}`
  if (getYear(timestamp) !== getYear(now)) {
    return format(timestamp, 'd. MMM yyyy HH:mm', { locale: nb })
  }
  return format(timestamp, 'EEE d. MMM HH:mm', { locale: nb })
}

// amount is what the member paid. resolvedAmount is what goes into the
// account, without the Stripe fee (ksg-nett-backend/economy/models.py).
export function depositAmounts(
  deposit: Pick<DepositNode, 'amount' | 'resolvedAmount'>
) {
  const credited = deposit.resolvedAmount ?? deposit.amount
  return {
    credited,
    paid: deposit.amount !== credited ? deposit.amount : null,
  }
}
