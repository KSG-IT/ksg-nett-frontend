import { formatDistanceStrict as formatDistanceStrictBase } from 'date-fns'
import { nb } from 'date-fns/locale'

interface FormatDistanceStrictOptions {
  addSuffix?: boolean
}

export function formatDistanceStrict(
  firstDate: Date,
  secondDate: Date,
  options: FormatDistanceStrictOptions = {}
) {
  return formatDistanceStrictBase(firstDate, secondDate, {
    locale: nb,
    ...options,
  })
}
