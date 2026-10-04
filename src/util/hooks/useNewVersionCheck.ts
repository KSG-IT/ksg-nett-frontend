import { showNotification } from '@mantine/notifications'
import { useEffect } from 'react'
import { fetchDeployedBuildId, isNewBuild } from 'util/version'

const CHECK_INTERVAL_MS = 30 * 60 * 1000
const NOTIFICATION_ID = 'new-version'

// Shows a notification when a newer build is deployed. An installed iPhone app
// is often resumed from memory and not reloaded, so it checks again each time
// the app comes back to the foreground. The user reloads, so no form is lost.
export function useNewVersionCheck() {
  useEffect(() => {
    // Only the local Vite dev server has import.meta.hot. Do not use
    // import.meta.env.DEV: the app-dev build sets NODE_ENV=development.
    if (import.meta.hot) return

    let notified = false

    async function check() {
      if (notified || document.visibilityState !== 'visible') return
      const deployedBuildId = await fetchDeployedBuildId()
      if (notified || !isNewBuild(BUILD_ID, deployedBuildId)) return

      notified = true
      showNotification({
        id: NOTIFICATION_ID,
        title: 'Ny versjon av KSG-nett',
        message: 'Trykk her for å laste inn på nytt.',
        autoClose: false,
        style: { cursor: 'pointer' },
        onClick: () => window.location.reload(),
      })
    }

    check()
    const interval = window.setInterval(check, CHECK_INTERVAL_MS)
    document.addEventListener('visibilitychange', check)
    window.addEventListener('pageshow', check)

    return () => {
      window.clearInterval(interval)
      document.removeEventListener('visibilitychange', check)
      window.removeEventListener('pageshow', check)
    }
  }, [])
}
