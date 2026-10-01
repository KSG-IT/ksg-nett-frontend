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

/**
 * Safely parses a string value into a TypeScript string enum member.
 * Returns null if the value is not a valid member of the enum.
 */
export function parseEnum<T extends Record<string, string>>(
  enumObj: T,
  value: string | null
): T[keyof T] | null {
  if (value === null) return null
  return (Object.values(enumObj) as string[]).includes(value)
    ? (value as T[keyof T])
    : null
}

/**
 * Returns an onChange handler for Mantine Select that validates the value
 * against a string enum before passing it to the callback.
 */
export function enumHandler<T extends Record<string, string>>(
  enumObj: T,
  callback: (val: T[keyof T]) => void
): (val: string | null) => void {
  return val => {
    const parsed = parseEnum(enumObj, val)
    if (parsed !== null) callback(parsed)
  }
}

/**
 * Narrows a Radio.Group string value to the '' | 'yes' | 'no' type
 * expected by radioToBoolean. Returns null if the value is unexpected.
 */
export function parseYesNoRadio(val: string): '' | 'yes' | 'no' | null {
  if (val === '' || val === 'yes' || val === 'no') return val
  return null
}

/**
 * Returns an onChange handler for Mantine Radio.Group with yes/no options
 * that narrows the value before passing it to the callback.
 */
export function yesNoHandler(
  callback: (val: '' | 'yes' | 'no') => void
): (val: string) => void {
  return val => {
    const parsed = parseYesNoRadio(val)
    if (parsed !== null) callback(parsed)
  }
}
