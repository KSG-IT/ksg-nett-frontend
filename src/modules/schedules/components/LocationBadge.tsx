import { Badge, BadgeProps } from 'components/Badge'
import { LocationValues } from '../consts'
import { parseLocation } from '../util'

interface LocationBadgeProps extends Omit<BadgeProps, 'color' | 'children'> {
  location: LocationValues | null
}

// Use this badge wherever a location is shown, so every page uses the same
// colour for it (parseLocation).
export const LocationBadge: React.FC<LocationBadgeProps> = ({
  location,
  size = 'sm',
  ...badgeProps
}) => {
  const { name, color } = parseLocation(location)
  return (
    <Badge {...badgeProps} size={size} variant="light" color={color}>
      {name || 'Uten lokale'}
    </Badge>
  )
}
