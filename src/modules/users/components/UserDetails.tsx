import {
  Avatar,
  Card,
  Center,
  Divider,
  Grid,
  Group,
  Stack,
  Text,
  ThemeIcon,
  createStyles,
  Button,
} from '@mantine/core'
import {
  IconAt,
  IconBook,
  IconCake,
  IconMapPin,
  IconPhone,
  IconSchool,
} from '@tabler/icons'
import { PermissionGate } from 'components/PermissionGate'
import { useMediaQuery } from 'util/hooks'
import { PERMISSIONS } from 'util/permissions'
import { UserNode } from '../types'
import { IconWithData } from './IconWithData'

interface UserDetailsProps {
  user: Omit<UserNode, 'internalGroupPositionMembershipHistory'>
  onClick: () => void
}

export const UserDetails: React.FC<UserDetailsProps> = ({ user, onClick }) => {
  const { classes } = useStyles()
  const isMobile = useMediaQuery('(max-width: 800px)')
  const editButton = (
    <PermissionGate permissions={PERMISSIONS.users.change.user}>
      <Button variant="light" color={'samfundet-red'} onClick={onClick}>
        Endre
      </Button>
    </PermissionGate>
  )
  return (
    <Card withBorder radius={'md'} className={classes.card}>
      <Grid p={'xl'}>
        <Grid.Col xs={6} lg={6}>
          <Text className={classes.role}>{user.ksgStatus}</Text>
          {isMobile && (
            <Center mt={'xs'}>
              <Avatar src={user.profileImage} size="xl" radius={60} />
            </Center>
          )}

          <Text className={classes.name} mt={'sm'}>
            {user.fullName}
          </Text>
          <Divider my={'sm'} />
          <IconWithData icon={IconAt} userData={user.email} />
          <IconWithData icon={IconPhone} userData={user.phone} />
          <IconWithData icon={IconMapPin} userData={user.studyAddress} />
          <IconWithData icon={IconSchool} userData={user.study} />
          <IconWithData icon={IconCake} userData={user.dateOfBirth} />
          <Group spacing={'xs'} className={classes.bio} noWrap mt={'xl'}>
            <Text className={classes.aboutMe}>Om meg</Text>
            <ThemeIcon variant="light" color={'samfundet-red'}>
              <IconBook stroke={1.2} />
            </ThemeIcon>
          </Group>
          <Text mt={'xs'}>{user.biography}</Text>
        </Grid.Col>
        {!isMobile && (
          <Grid.Col xs={5} lg={5} offset={1}>
            <Stack
              justify={'space-between'}
              style={{ height: '100%' }}
              align="flex-end"
            >
              <Avatar
                src={
                  user.profileImage ||
                  'https://m.media-amazon.com/images/M/MV5BMjA5NTE4NTE5NV5BMl5BanBnXkFtZTcwMTcyOTY5Mw@@._V1_.jpg'
                }
                radius={'lg'}
                classNames={{
                  image: classes.profileImage,
                  root: classes.avatar,
                }}
              />
              {editButton}
            </Stack>
          </Grid.Col>
        )}
      </Grid>
      {isMobile && editButton}
    </Card>
  )
}

const useStyles = createStyles(theme => ({
  title: {
    color: theme.colors.gray[6],
    fontWeight: 'bold',
  },
  profileImage: {
    width: '100%',
    height: '100%',
    maxHeight: 350,
    fit: 'cover',
  },
  avatar: {
    width: 'auto',
    height: 'auto',
    maxHeight: '100%',
    fit: 'cover',
  },
  name: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    fontWeight: 500,
    fontSize: theme.fontSizes.lg * 1.25,
    [`@media (max-width: ${theme.breakpoints.md}px)`]: {
      textAlign: 'center',
    },
  },
  role: {
    color: theme.colors.gray[7],
    fontWeight: 700,
    textTransform: 'uppercase',
    fontSize: theme.fontSizes.lg,
    [`@media (max-width: ${theme.breakpoints.md}px)`]: {
      textAlign: 'center',
    },
  },
  aboutMe: {
    color: theme.colors.gray[7],
    fontWeight: 700,
    textTransform: 'uppercase',
    fontSize: theme.fontSizes.lg,
  },
  container: {
    // Media query with value from theme
    [`@media (max-width: ${theme.breakpoints.md}px)`]: {
      marginLeft: 0,
      marginRight: 0,
    },
  },
  wrapper: {
    [`@media (max-width: ${theme.breakpoints.md}px)`]: {
      marginLeft: 0,
      marginRight: 0,
    },
    marginTop: theme.spacing.md,
  },
  card: {},
  memberships: {},
  bio: {},
}))
