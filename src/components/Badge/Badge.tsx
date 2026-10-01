import {
  ElementProps,
  Badge as MantineBadge,
  BadgeProps as MantineBadgeProps,
} from '@mantine/core'

export interface BadgeProps
  extends MantineBadgeProps,
    ElementProps<'div', keyof MantineBadgeProps> {}

/**
 * Mantine Badge that always shows its full label. Since Mantine 7 the badge is
 * a grid that can shrink to nothing in a narrow table column.
 */
export function Badge({ style, ...props }: BadgeProps) {
  return (
    <MantineBadge {...props} style={[{ minWidth: 'max-content' }, style]} />
  )
}
