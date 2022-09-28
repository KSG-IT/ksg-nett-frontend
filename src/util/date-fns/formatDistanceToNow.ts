import { formatDistanceToNow as formatDistanceToNowBase } from 'date-fns'
import { nb } from 'date-fns/locale'

export interface FormatDistanceToNowOptions {
  addSuffix?: boolean
  includeSeconds?: boolean
}
export function formatDistanceToNow(
  firstDate: Date,
  options: FormatDistanceToNowOptions = {}
) {
  return formatDistanceToNowBase(firstDate, {
    ...options,
    locale: nb,
  })
}
