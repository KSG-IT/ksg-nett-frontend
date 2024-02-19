import { Image, Card, createStyles, Stack, Text } from '@mantine/core'

import { useStore } from 'store'
import { UserNode } from 'modules/users/types'

interface UserCardProps {
  user: Pick<UserNode, 'id' | 'firstName' | 'lastName' | 'profileImage'>
  displaySemester?: boolean
}
export const UserCard: React.FC<UserCardProps> = ({
  user,
  displaySemester,
}) => {
  const { classes } = useStyles()

  const me = useStore(state => state.user)!

  return (
    <Card radius={'md'} className={classes.card} key={user.id} withBorder>
      <Stack justify={'space-between'} spacing={'xs'} className={classes.card}>
        <Stack spacing={'xs'}>
          <Card.Section>
            <Image
              src={user.profileImage}
              height={200}
              alt={'Profile picture of ' + user.firstName + ' ' + user.lastName}
            />
          </Card.Section>
          <Text size={'sm'} className={classes.nameText}>
            {user.firstName + ' ' + user.lastName}
          </Text>
          <Text>{displaySemester}</Text>
        </Stack>
      </Stack>
    </Card>
  )
}

const useStyles = createStyles(theme => ({
  nameText: {
    color: theme.colors.dark,
    fontWeight: 500,
  },
  card: {
    width: 'auto',
    height: 'auto',
    overflow: 'visible',
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
}))
