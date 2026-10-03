import {
  activityKind,
  activityTime,
  depositAmounts,
  formatAmount,
  signedAmount,
} from './transactions'
import { BankAccountActivity } from './types.graphql'

function activity(
  name: string,
  amount: number,
  quantity: number | null = null
): BankAccountActivity {
  return {
    name,
    amount,
    quantity: quantity as number,
    timestamp: new Date('2026-10-03T21:14:00'),
  }
}

const beer = activity('Øl', 96, 2)
const deposit = activity('Innskudd', 500)
const transferIn = activity('Overføring', 200)
const transferOut = activity('Overføring', -150)

describe('activityKind', () => {
  it('reads deposits and transfers from the name, and the rest are purchases', () => {
    expect(activityKind(beer)).toBe('purchase')
    expect(activityKind(deposit)).toBe('deposit')
    expect(activityKind(transferOut)).toBe('transfer')
  })
})

describe('signedAmount', () => {
  it('makes purchases negative, because the API gives the cost', () => {
    expect(signedAmount(beer)).toBe(-96)
  })

  it('keeps the sign of deposits and transfers', () => {
    expect(signedAmount(deposit)).toBe(500)
    expect(signedAmount(transferIn)).toBe(200)
    expect(signedAmount(transferOut)).toBe(-150)
  })
})

describe('formatAmount', () => {
  it('shows a sign, a minus sign character and no-break spaces', () => {
    expect(formatAmount(-96)).toBe('−96\u00a0kr')
    expect(formatAmount(500)).toBe('+500\u00a0kr')
    expect(formatAmount(-1250)).toBe('−1\u00a0250\u00a0kr')
    expect(formatAmount(0)).toBe('0\u00a0kr')
  })
})

describe('activityTime', () => {
  const now = new Date('2026-10-03T23:00:00')

  it('says i dag and i går, and the date for older days', () => {
    expect(activityTime(new Date('2026-10-03T21:14:00'), now)).toBe(
      'I dag 21:14'
    )
    expect(activityTime(new Date('2026-10-02T08:05:00'), now)).toBe(
      'I går 08:05'
    )
    expect(activityTime(new Date('2026-09-28T19:30:00'), now)).toBe(
      'man 28. sep. 19:30'
    )
  })

  it('adds the year when it is not this year', () => {
    expect(activityTime(new Date('2025-12-31T23:59:00'), now)).toBe(
      '31. des. 2025 23:59'
    )
  })
})

describe('depositAmounts', () => {
  it('shows the credited amount, and the paid amount when a fee was added', () => {
    expect(depositAmounts({ amount: 512, resolvedAmount: 500 })).toEqual({
      credited: 500,
      paid: 512,
    })
  })

  it('has no paid amount when it is the same as the credited amount', () => {
    expect(depositAmounts({ amount: 500, resolvedAmount: 500 })).toEqual({
      credited: 500,
      paid: null,
    })
  })

  it('uses the paid amount when nothing is credited yet', () => {
    expect(depositAmounts({ amount: 300, resolvedAmount: null })).toEqual({
      credited: 300,
      paid: null,
    })
  })
})
