import { Badge } from '@mantine/core'

interface UnreadBadgeProps {
  count: number
}

// A red count. Hidden at 0, "99+" above 99.
export const UnreadBadge: React.FC<UnreadBadgeProps> = ({ count }) => {
  if (count <= 0) return null
  return (
    <Badge
      color="samfundet-red"
      variant="filled"
      size="sm"
      circle={count < 10}
      aria-label={`${count} uleste`}
    >
      {count > 99 ? '99+' : count}
    </Badge>
  )
}
