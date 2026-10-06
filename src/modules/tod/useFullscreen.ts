import { useCallback } from 'react'

export function useFullscreen() {
  return useCallback(() => {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => undefined)
    } else {
      document.documentElement.requestFullscreen().catch(() => undefined)
    }
  }, [])
}
