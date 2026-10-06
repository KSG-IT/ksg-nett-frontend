import { useEffect, useState } from 'react'

// The current time, updated every intervalMs, so a deadline in the text and
// in disabled states passes while the page is open.
export function useNow(intervalMs = 30_000) {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), intervalMs)
    return () => clearInterval(timer)
  }, [intervalMs])
  return now
}
