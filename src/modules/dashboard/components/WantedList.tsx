import { Avatar, Text } from '@mantine/core'
import { formatKroner } from 'modules/economy/transactions'
import { UserNode, UserThumbnailProps } from 'modules/users/types'
import { Link } from 'react-router-dom'
import classes from './WantedList.module.css'

// The dashboard query has getFullWithNickName, not fullName.
export type WantedUser = Pick<UserNode, 'balance' | 'initials'> &
  UserThumbnailProps['user']

interface WantedListProps {
  users: WantedUser[]
}

// Members with a balance at or below WANTED_LIST_THRESHOLD in the backend.
// It is rare, so the posters can have some fun.
export const WantedList: React.FC<WantedListProps> = ({ users }) => (
  <section className={classes.section} aria-labelledby="wanted-title">
    <Text id="wanted-title" c="dimmed" fw={700}>
      Etterlyst
    </Text>
    <div className={classes.posters}>
      {users.map(user => (
        <WantedPoster key={user.id} user={user} />
      ))}
    </div>
  </section>
)

interface WantedPosterProps {
  user: WantedUser
}

const WantedPoster: React.FC<WantedPosterProps> = ({ user }) => (
  <Link
    to={`/users/${user.id}`}
    className={classes.poster}
    aria-label={`${user.getFullWithNickName} skylder ${formatKroner(
      user.balance
    )}`}
  >
    <span className={classes.wanted}>Wanted</span>
    <Avatar
      src={user.profileImage || undefined}
      size={44}
      radius="xs"
      className={classes.photo}
    >
      {user.initials}
    </Avatar>
    <Text className={classes.name} lineClamp={2}>
      {user.getFullWithNickName}
    </Text>
    <span className={classes.reward}>Skylder {formatKroner(user.balance)}</span>
  </Link>
)
