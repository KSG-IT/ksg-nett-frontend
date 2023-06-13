import { useMantineTheme } from '@mantine/core'
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

export function randomizeColors() {
  const theme = useMantineTheme()
  let colors = []
  const mantineColors = theme.colors
  colors.push(
    ...Object.keys(mantineColors).map(color => {
      if (
        color !== 'dark' &&
        color !== 'white' &&
        color !== 'gray' &&
        color !== 'brand'
      ) {
        return color
      } else return null
    })
  )
  colors = colors.filter(color => color !== null)

  // Shuffle colors
  for (let i = colors.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[colors[i], colors[j]] = [colors[j], colors[i]]
  }
  console.log(colors)
  return colors
}
