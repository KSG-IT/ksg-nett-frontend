export function numberWithSpaces(x: number | string | null | undefined) {
  if (x === undefined || x === null) return ''
  var parts
  if (typeof x === 'number') {
    parts = x.toString().split('.')
  } else if (typeof x === 'string') {
    parts = x.split('.')
  } else return
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
  return parts.join('.')
}

export function parseDurationString(input: string): string {
  return input
    .split('')
    .filter(char => char === ':' || !isNaN(parseInt(char)))
    .join('')
}

export const booleanToRadio = (input: boolean | null): '' | 'yes' | 'no' => {
  /**
   * Parses a boolean value to a "yes" "no" or blank string value to use when parsing GraphQL
   * data. We implement it this way instead of checkboxes for UX reasons
   */

  switch (input) {
    case true:
      return 'yes'
    case false:
      return 'no'
    case null:
      return ''
  }
}

export const radioToBoolean = (input: '' | 'yes' | 'no') => {
  /**
   * Parses a yes-no radiogrorup to a a boolean value to use in GraphQL mutations.
   * We implement it this way instead of checkboxes for UX reasons
   */
  switch (input) {
    case '':
      return null
    case 'yes':
      return true
    case 'no':
      return false
  }
}

export const capitalizeFirstLetter = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1)
}
