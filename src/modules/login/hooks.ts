import { useLocation } from 'react-router-dom'
import queryString from 'query-string'
import { fromUnixTime } from 'date-fns'

export function useJwtTokenFromQueryString() {
  const location = useLocation()

  const search = queryString.parse(location.search)
  const token = search.token as string

  const tokenData =
    token &&
    JSON.parse(
      // Base64-decode
      atob(
        // Data is contained after the first dot
        token.split('.')[1]
      )
    )

  const expirationTimestamp = (tokenData?.exp as number) || 0
  const expirationDate = fromUnixTime(expirationTimestamp)

  return {
    token,
    expirationDate,
  }
}
