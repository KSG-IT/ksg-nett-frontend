import { cardDepositAmounts, depositAmountSchema } from './deposit'

const fee = { flatFee: 2, percentageFee: 2.4 }

describe('cardDepositAmounts', () => {
  it('matches the backend for the presets', () => {
    expect(cardDepositAmounts(100, fee).total).toBe(105)
    expect(cardDepositAmounts(200, fee).total).toBe(207)
    expect(cardDepositAmounts(500, fee).total).toBe(515)
  })

  it('splits the total into credit and fee', () => {
    expect(cardDepositAmounts(200, fee)).toEqual({
      credit: 200,
      fee: 7,
      total: 207,
    })
  })

  it('uses the fee settings it gets', () => {
    expect(
      cardDepositAmounts(200, { flatFee: 2, percentageFee: 3.4 }).total
    ).toBe(210)
  })
})

function errorFor(amount: unknown) {
  const result = depositAmountSchema.safeParse(amount)
  return result.success ? null : result.error.issues[0].message
}

describe('depositAmountSchema', () => {
  it('accepts an amount in the range', () => {
    expect(errorFor(1)).toBeNull()
    expect(errorFor(30_000)).toBeNull()
  })

  it('asks for at least 1 kr when the amount is empty or too small', () => {
    expect(errorFor(undefined)).toBe('Minst 1 kr')
    expect(errorFor(NaN)).toBe('Minst 1 kr')
    expect(errorFor(0)).toBe('Minst 1 kr')
  })

  it('stops at 30 000 kr', () => {
    expect(errorFor(30_001)).toBe('Maks 30 000 kr')
  })

  it('takes whole kroner only', () => {
    expect(errorFor(10.5)).toBe('Bare hele kroner')
  })
})
