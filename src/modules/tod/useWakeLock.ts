import { useEffect } from 'react'

// Keep the laptop screen on while the game runs on the TV.
export function useWakeLock(active: boolean) {
  useEffect(() => {
    if (!active || !('wakeLock' in navigator)) return
    let lock: WakeLockSentinel | null = null
    let cancelled = false

    const request = async () => {
      try {
        lock = await navigator.wakeLock.request('screen')
        if (cancelled) lock.release()
      } catch {
        // The browser can refuse, for example on low battery.
      }
    }
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') request()
    }

    request()
    document.addEventListener('visibilitychange', handleVisibility)
    return () => {
      cancelled = true
      document.removeEventListener('visibilitychange', handleVisibility)
      lock?.release()
    }
  }, [active])
}
