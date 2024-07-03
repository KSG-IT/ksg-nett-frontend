import {
  Avatar,
  Button,
  Card,
  Center,
  Divider,
  Grid,
  Group,
  Stack,
  Text,
  ThemeIcon,
} from '@mantine/core'
import { createStyles } from '@mantine/emotion'
import {
  IconAt,
  IconBook,
  IconBook2,
  IconCake,
  IconHome,
  IconMapPin,
  IconPhone,
  IconSchool,
} from '@tabler/icons-react'
import { Breadcrumbs } from 'components/Breadcrumbs'
import { PermissionGate } from 'components/PermissionGate'
import { useIsMobile } from 'util/hooks'
import { PERMISSIONS } from 'util/permissions'
import { UserNode } from '../types'
import { IconWithData } from './IconWithData'

const breadcrumbsItems = [
  { label: 'Hjem', path: '/dashboard' },
  { label: 'Brukere', path: '' },
]

interface UserDetailsProps {
  user: Omit<UserNode, 'internalGroupPositionMembershipHistory'>
  onClick: () => void
}

export const UserDetails: React.FC<UserDetailsProps> = ({ user, onClick }) => {
  const { classes } = useStyles()
  const isMobile = useIsMobile()
  const editButton = (
    <PermissionGate permissions={PERMISSIONS.users.change.user}>
      <Button variant="light" color={'samfundet-red'} onClick={onClick}>
        Endre
      </Button>
    </PermissionGate>
  )

  const overloadedBreadcrumbs = [
    ...breadcrumbsItems,
    { label: user.getFullWithNickName, path: '' },
  ]

  return (
    <Stack>
      <Breadcrumbs items={overloadedBreadcrumbs} />
      <Card withBorder radius={'md'} className={classes.card}>
        <Grid p={'xl'}>
          <Grid.Col span={{ xs: 6, lg: 6 }}>
            <Text className={classes.role}>{user.ksgStatus}</Text>
            {isMobile && (
              <Center>
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
              </Center>
            )}

            <Text className={classes.name} mt={'sm'}>
              {user.getFullWithNickName}
            </Text>
            <Divider my={'sm'} />
            <IconWithData icon={IconAt} userData={user.email} type="email" />
            <IconWithData icon={IconPhone} userData={user.phone} type="tel" />
            <IconWithData icon={IconHome} userData={user.homeTown} />
            <IconWithData icon={IconMapPin} userData={user.studyAddress} />
            <IconWithData icon={IconSchool} userData={user.study} />
            <IconWithData icon={IconCake} userData={user.dateOfBirth} />
            <Group gap={'xs'} className={classes.bio} wrap="nowrap" mt={'xl'}>
              <Text className={classes.aboutMe}>Om meg</Text>
              <ThemeIcon variant="light" color={'samfundet-red'}>
                {user.canRewriteAboutMe ? (
                  <IconBook stroke={1.2} />
                ) : (
                  <IconBook2 stroke={1.2} />
                )}
              </ThemeIcon>
            </Group>
            <Text mt={'xs'}>{user.aboutMe}</Text>
          </Grid.Col>
          {!isMobile && (
            <Grid.Col span={{ xs: 5, lg: 5 }} offset={1}>
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
    </Stack>
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
    fontSize: (theme.fontSizes.lg as unknown as number) * 1.25,
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
