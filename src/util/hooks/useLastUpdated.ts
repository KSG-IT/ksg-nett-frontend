import { NetworkStatus } from '@apollo/client'
import { useEffect, useState } from 'react'

// The time when a query last finished fetching, for a "Sist oppdatert" label.
// The query needs `notifyOnNetworkStatusChange: true`. Without it, a poll that
// brings no change does not re-render, and the time would not move.
export function useLastUpdated(networkStatus: NetworkStatus) {
  const [updatedAt, setUpdatedAt] = useState(() => new Date())
  useEffect(() => {
    if (networkStatus === NetworkStatus.ready) setUpdatedAt(new Date())
  }, [networkStatus])
  return updatedAt
}
