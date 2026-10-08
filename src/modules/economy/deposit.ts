import { z } from 'zod'

export const MIN_DEPOSIT = 1
export const MAX_DEPOSIT = 30_000
export const DEPOSIT_PRESETS = [100, 200, 500]
export const SOCIETETEN_ACCOUNT_NUMBER = '1503.88.72882'

export interface StripeDepositFee {
  flatFee: number
  percentageFee: number
}

export interface CardDepositAmounts {
  credit: number
  fee: number
  total: number
}

/**
 * The amount to pay by card for `credit` kr on the account. Stripe takes its
 * fee from the total, so the percentage applies to the total. Rounded up to the
 * nearest whole krone. The same operations as stripe_amount_with_fee in the
 * backend, so both round the same way.
 */
export function cardDepositAmounts(
  credit: number,
  { flatFee, percentageFee }: StripeDepositFee
): CardDepositAmounts {
  const total = Math.ceil(credit / (1 - percentageFee / 100) + flatFee)
  return { credit, fee: total - credit, total }
}

/** The amount to deposit, in whole kroner. The backend has the same limits */
export const depositAmountSchema = z
  .number({ error: 'Minst 1 kr' })
  .int('Bare hele kroner')
  .min(MIN_DEPOSIT, 'Minst 1 kr')
  .max(MAX_DEPOSIT, 'Maks 30 000 kr')
