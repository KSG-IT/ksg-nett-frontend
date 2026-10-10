import { ObservableQuery } from '@apollo/client'
import { useEffect } from 'react'

type PollingControls = Pick<
  ObservableQuery,
  'startPolling' | 'stopPolling' | 'refetch'
>

// Polls a query only while the tab is visible. A hidden tab (a forgotten
// browser tab, a locked phone) stops polling. When the tab shows again, the
// query refetches at once, so the data is fresh when somebody looks at it.
// Apollo's `pollInterval` option keeps polling in hidden tabs.
export function useVisiblePolling(
  { startPolling, stopPolling, refetch }: PollingControls,
  intervalMs: number
) {
  useEffect(() => {
    function onVisibilityChange() {
      if (document.visibilityState === 'visible') {
        refetch()
        startPolling(intervalMs)
      } else {
        stopPolling()
      }
    }

    if (document.visibilityState === 'visible') startPolling(intervalMs)
    document.addEventListener('visibilitychange', onVisibilityChange)

    return () => {
      document.removeEventListener('visibilitychange', onVisibilityChange)
      stopPolling()
    }
  }, [startPolling, stopPolling, refetch, intervalMs])
}
