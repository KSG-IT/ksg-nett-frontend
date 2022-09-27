import { useQuery } from '@apollo/client'
import {
  Avatar,
  Card,
  Center,
  Container,
  createStyles,
  Divider,
  Grid,
  Group,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core'
import {
  IconAt,
  IconBook,
  IconCake,
  IconMapPin,
  IconPhone,
  IconSchool,
} from '@tabler/icons'
import { FullPage404, FullPageError } from 'components/FullPageComponents'
import { FullContentLoader } from 'components/Loading'
import { useParams } from 'react-router-dom'
import { useMediaQuery } from 'util/hooks'
import { UserQueryReturns, UserQueryVariables, USER_QUERY } from '..'
import { IconWithData } from '../components/IconWithData'
import { UserEditForm } from '../components/UserEdit/UserEditForm'
import { UserHistory } from '../components/UserHistory'
import { UserQuotes } from '../components/UserQuotes'

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
  card: {
    maxWidth: 900,
  },
  memberships: {
    [`@media (max-width: ${theme.breakpoints.md}px)`]: {
      marginLeft: theme.spacing.md,
      marginRight: theme.spacing.md,
    },
    marginLeft: theme.spacing.xl,
  },
}))

interface UserProfileParams {
  userId: string
}

export const UserProfile: React.FC = () => {
  const { classes } = useStyles()
  const mediaQuery = useMediaQuery('(min-width: 800px)')
  const { userId } = useParams<keyof UserProfileParams>() as UserProfileParams
  const { data, loading, error } = useQuery<
    UserQueryReturns,
    UserQueryVariables
  >(USER_QUERY, {
    variables: { id: userId },
  })

  if (error) return <FullPageError />
  if (loading || !data) return <FullContentLoader />

  const fullUser = data.user
  const {
    user: { internalGroupPositionMembershipHistory: memberships, ...user },
  } = data

  if (user === null || user === undefined) return <FullPage404 />

  return (
    <Group align={'flex-start'} className={classes.wrapper}>
      <Stack align={'flex-start'}>
        <Card shadow={'sm'} radius={'md'} className={classes.card}>
          <Grid p={'xl'}>
            <Grid.Col xs={6} lg={6}>
              <Text className={classes.role}>{user.ksgStatus}</Text>
              {mediaQuery ? null : (
                <Center mt={'xs'}>
                  <Avatar src={user.profileImage} size="xl" radius={60} />
                </Center>
              )}

              <Text mt={'sm'} className={classes.name}>
                {user.fullName}
              </Text>
              <Divider my={'sm'} />
              <IconWithData icon={IconAt} userData={user.email} />
              <IconWithData icon={IconPhone} userData={user.phone} />
              <IconWithData icon={IconMapPin} userData={user.studyAddress} />
              <IconWithData icon={IconSchool} userData={user.study} />
              <IconWithData icon={IconCake} userData={user.dateOfBirth} />
              <Group noWrap spacing={10} mt={'xl'}>
                <ThemeIcon variant="light" color={'orange'}>
                  <IconBook stroke={1.2} />
                </ThemeIcon>
                <Text className={classes.role}>Om meg</Text>
              </Group>
              <Text mt={'xs'}>{user.biography}</Text>
            </Grid.Col>
            {mediaQuery ? (
              <Grid.Col xs={5} lg={5} offset={1}>
                <Stack
                  justify={'space-between'}
                  style={{ height: '100%' }}
                  align="flex-end"
                >
                  <Avatar
                    src={user.profileImage}
                    radius={'lg'}
                    classNames={{
                      image: classes.profileImage,
                      root: classes.avatar,
                    }}
                  />
                  <UserEditForm user={fullUser} />
                </Stack>
              </Grid.Col>
            ) : null}
          </Grid>
        </Card>
        <Stack ml={'sm'} mt={'md'}>
          <Title order={3} className={classes.title}>
            Sitater
          </Title>
          <UserQuotes quotes={user.taggedAndVerifiedQuotes} />
        </Stack>
      </Stack>
      <Stack justify={'flex-end'} className={classes.memberships}>
        <Title order={3} className={classes.title}>
          Vervhistorikk
        </Title>
        <UserHistory memberships={memberships} />
      </Stack>
    </Group>
  )
}
