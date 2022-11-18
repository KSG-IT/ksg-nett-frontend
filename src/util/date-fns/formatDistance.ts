import { formatDistance as formatDistanceBase } from 'date-fns'
import { nb } from 'date-fns/locale'

interface FormatDistanceOptions {
  includeSeconds?: boolean
  addSuffix?: boolean
}

export function formatDistance(
  firstDate: Date,
  secondDate: Date,
  options: FormatDistanceOptions = {}
) {
  return formatDistanceBase(firstDate, secondDate, {
    locale: nb,
    ...options,
  })
}
