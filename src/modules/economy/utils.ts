import { Liquidity, SociSessionType } from './types.graphql'

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

export function getSoiSeccionTypeColor(type: SociSessionType) {
  switch (type) {
    case SociSessionType.SOCIETETEN:
      return 'blue'
    case SociSessionType.STILLETIME:
      return 'yellow'
    case SociSessionType.KRYSSELISTE:
      return 'grape'
    case SociSessionType.BURGERLISTE:
      return 'orange'
    default:
      return 'samfundet-red'
  }
}
