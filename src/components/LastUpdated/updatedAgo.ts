import { formatDistanceStrict } from '../../util/date-fns'

const JUST_NOW_SECONDS = 5

// "akkurat nå" for the first seconds, then "12 sekunder siden", "2 minutter siden".
export function updatedAgo(updatedAt: Date, now: Date) {
  const seconds = (now.getTime() - updatedAt.getTime()) / 1000
  if (seconds < JUST_NOW_SECONDS) return 'akkurat nå'
  return `${formatDistanceStrict(updatedAt, now)} siden`
}
