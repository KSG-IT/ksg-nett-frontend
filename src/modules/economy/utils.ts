import { Liquidity } from './types'

export const getLiquidity = (balance: number): Liquidity => {
  if (balance < 0) {
    return 'negative'
  } else if (0 <= balance && balance < 100) {
    return 'neutral'
  } else if (100 <= balance && balance < 1000) {
    return 'positive'
  } else {
    return 'loaded'
  }
}
