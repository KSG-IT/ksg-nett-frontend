import { Avatar, Tooltip } from '@mantine/core'
import { UserThumbnail } from 'modules/users/components'
import { DayShift, DayShiftSlot } from '../../allShifts'
import { parseShiftRole } from '../../util'
import classes from './ShiftAvatars.module.css'

interface ShiftAvatarsProps {
  shift: DayShift
  meId?: string
  // At most this many people; the rest become "+N".
  max?: number
  size?: number
  // false inside a button (the timeline bars): plain avatars, no links.
  linked?: boolean
}

// Small overlapping avatars. Empty slots are dashed circles at the end.
export const ShiftAvatars: React.FC<ShiftAvatarsProps> = ({
  shift,
  max = 4,
  size = 28,
  ...props
}) => {
  const filled = shift.slots.filter(slot => slot.user !== null)
  const open = shift.slots.filter(slot => slot.user === null)

  return (
    <Avatar.Group spacing={size / 4}>
      <PeopleAvatars slots={filled.slice(0, max)} size={size} {...props} />
      {filled.length > max && (
        <Avatar size={size} color="gray">
          +{filled.length - max}
        </Avatar>
      )}
      {open.length > 0 && <OpenSlotsAvatar slots={open} size={size} />}
    </Avatar.Group>
  )
}

interface PeopleAvatarsProps {
  slots: DayShiftSlot[]
  size: number
  meId?: string
  linked?: boolean
}

const PeopleAvatars: React.FC<PeopleAvatarsProps> = ({ slots, ...props }) => (
  <>
    {slots.map(slot => (
      <PersonAvatar key={slot.id} user={slot.user!} {...props} />
    ))}
  </>
)

interface PersonAvatarProps {
  user: NonNullable<DayShiftSlot['user']>
  size: number
  meId?: string
  linked?: boolean
}

const PersonAvatar: React.FC<PersonAvatarProps> = ({
  user,
  size,
  meId,
  linked = true,
}) => {
  const className = user.id === meId ? classes.mine : undefined

  if (linked) {
    return <UserThumbnail user={user} size={size} className={className} />
  }

  return (
    <Avatar
      size={size}
      color="samfundet-red"
      src={user.profileImage || undefined}
      alt={user.getFullWithNickName}
      className={className}
    >
      {user.initials}
    </Avatar>
  )
}

interface OpenSlotsAvatarProps {
  slots: DayShiftSlot[]
  size: number
}

const OpenSlotsAvatar: React.FC<OpenSlotsAvatarProps> = ({ slots, size }) => {
  const roles = slots.map(slot => parseShiftRole(slot.role)).join(', ')

  return (
    <Tooltip label={`Ledig: ${roles}`} withArrow>
      <Avatar size={size} className={classes.empty}>
        {slots.length > 1 ? `+${slots.length}` : '+'}
      </Avatar>
    </Tooltip>
  )
}
