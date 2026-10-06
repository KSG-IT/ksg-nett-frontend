import { IconUserPlus } from '@tabler/icons-react'
import { TodPlayerNode } from '../../types.graphql'
import { groupOf } from '../../players'
import classes from './Lobby.module.css'

interface PlayerSearchOptionProps {
  user: TodPlayerNode | null
  label: string
}

// One row in the player search: a member with picture and gjeng, or the
// "add as guest" row.
export const PlayerSearchOption: React.FC<PlayerSearchOptionProps> = ({
  user,
  label,
}) => {
  if (!user) {
    return (
      <span className={classes.optionRow}>
        <span className={classes.optionAvatar} data-guest>
          <IconUserPlus size="1.1em" />
        </span>
        {label}
      </span>
    )
  }

  return (
    <span className={classes.optionRow}>
      <span className={classes.optionAvatar}>
        {user.profileImage ? (
          <img src={user.profileImage} alt="" />
        ) : (
          user.initials
        )}
      </span>
      <span className={classes.optionText}>
        {user.getCleanFullName}
        <span className={classes.optionGroup}>{groupOf(user) ?? 'KSG'}</span>
      </span>
    </span>
  )
}
