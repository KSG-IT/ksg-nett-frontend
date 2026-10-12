import { useIntersection } from '@mantine/hooks'
import { useEffect } from 'react'

interface EndOfSummaryProps {
  onReached: () => void
}

/**
 * An invisible marker after the contents. It calls `onReached` when it scrolls
 * into view. A short summary shows its end at once, so the call comes at once.
 */
export const EndOfSummary: React.FC<EndOfSummaryProps> = ({ onReached }) => {
  const { ref, entry } = useIntersection({ threshold: 1 })
  const reached = entry?.isIntersecting ?? false

  useEffect(() => {
    if (reached) onReached()
  }, [reached, onReached])

  return <div ref={ref} aria-hidden="true" style={{ height: 1 }} />
}
