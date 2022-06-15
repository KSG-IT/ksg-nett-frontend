export const parseBooleanEvaluation = (value: true | false | null) => {
  switch (value) {
    case true:
      return 'Ja'
    case false:
      return 'Nei'
    case null:
      return 'Ubesvart'
  }
}

export const parseAdditionalEvaluation = (
  value: 'VERY_LITTLE' | 'LITTLE' | 'MEDIUM' | 'SOMEWHAT' | 'VERY' | null
) => {
  switch (value) {
    case 'VERY_LITTLE':
      return 'Veldig lite'
    case 'LITTLE':
      return 'Lite'
    case 'MEDIUM':
      return 'Middels'
    case 'SOMEWHAT':
      return 'Litt'
    case 'VERY':
      return 'Veldig'
    case null:
      return 'Ikke evaluert'
  }
}

export const parseTotalEvaluation = (
  value: 'VERY_POOR' | 'POOR' | 'MEDIUM' | 'GOOD' | 'VERY_GOOD' | null
) => {
  switch (value) {
    case 'VERY_POOR':
      return 'Veldig dårlig'
    case 'POOR':
      return 'Dårlig'
    case 'MEDIUM':
      return 'Middels'
    case 'GOOD':
      return 'Bra'
    case 'VERY_GOOD':
      return 'Veldig bra'
    case null:
      return 'Ikke evaluert'
  }
}
