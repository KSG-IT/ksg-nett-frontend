import { useQuery } from '@apollo/client'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  Avatar,
  Card,
  Center,
  Container,
  createStyles,
  Divider,
  Grid,
  Group,
  Space,
  Stack,
  Text,
  Title,
} from '@mantine/core'
import { useParams } from 'react-router-dom'
import { useMediaQuery } from 'util/hooks'
import {
  IconWithDataProps,
  UserQueryReturns,
  UserQueryVariables,
  USER_QUERY,
} from '.'
import { UserHistory } from './components/UserHistory'
import { UserQuotes } from './components/UserQuotes'

interface UserProfileParams {
  userId: string
}

const useStyles = createStyles(theme => ({
  detailsWrapper: {
    padding: '0px',
    margin: '0px',
  },
  detailsCard: {
    color: 'black',
    maxWidth: 900,
  },
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
  icon: {
    color:
      theme.colorScheme === 'dark'
        ? theme.colors.dark[5]
        : theme.colors.gray[7],
  },
  name: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    fontWeight: 500,
    fontSize: theme.fontSizes.lg * 1.25,
  },
  role: {
    color: theme.colors.gray[7],
    fontWeight: 700,
    textTransform: 'uppercase',
    fontSize: theme.fontSizes.lg,
  },
  list: {
    color: theme.colors.gray[7],
  },
}))

export function UserProfile() {
  const { classes } = useStyles()
  const mediaQuery = useMediaQuery('(min-width: 800px)')
  const { userId } = useParams<UserProfileParams>()
  const { data, loading, error } = useQuery<
    UserQueryReturns,
    UserQueryVariables
  >(USER_QUERY, {
    variables: { id: userId },
  })
  if (loading) return <span>Loading</span>

  if (!data || error) return <span>Something went wrong</span>

  const {
    user: { internalGroupPositionMembershipHistory: memberships, ...user },
  } = data

  if (user === null || user === undefined)
    return <span>Bruker eksisterer ikke</span>

  const IconWithData: React.FC<IconWithDataProps> = ({ icon, userData }) => {
    return (
      <Grid align={'center'} columns={12}>
        <Grid.Col span={1}>
          <Stack align={'center'}>
            <FontAwesomeIcon
              icon={icon}
              className={classes.icon}
              style={{ color: 'darkgoldenrod' }}
            />
          </Stack>
        </Grid.Col>
        <Grid.Col span={10}>
          <Text size="sm" color={'dimmed'}>
            {userData}
          </Text>
        </Grid.Col>
      </Grid>
    )
  }

  return (
    <Group align={'flex-start'} mt={50} mx={'md'}>
      <Stack align={'flex-start'}>
        <Container>
          <Card shadow={'sm'} radius={'md'}>
            <Grid p={'xl'}>
              <Grid.Col xs={6} lg={6}>
                <Text
                  align={mediaQuery ? 'left' : 'center'}
                  className={classes.role}
                >
                  {user.ksgStatus}
                </Text>
                {mediaQuery ? null : (
                  <Center>
                    <Avatar src={user.profileImage} size="xl" radius={60} />
                  </Center>
                )}

                <Space h={'xs'} />
                <Text
                  align={`${mediaQuery ? 'left' : 'center'}`}
                  className={classes.name}
                >
                  {user.fullName}
                </Text>
                <Divider my={'sm'} />
                <IconWithData icon={'at'} userData={user.email} />
                <IconWithData icon={'phone'} userData={user.phone} />
                <IconWithData
                  icon={'map-marker-alt'}
                  userData={user.studyAddress}
                />
                <IconWithData icon={'graduation-cap'} userData={user.study} />
                <IconWithData
                  icon={'birthday-cake'}
                  userData={user.dateOfBirth}
                />
                <Group noWrap spacing={10} mt={'xl'}>
                  <FontAwesomeIcon
                    icon={['fas', 'book-open']}
                    className={classes.icon}
                  />
                  <Text className={classes.role}>Om meg</Text>
                </Group>
                <Text mt={'xs'}>{user.biography}</Text>
              </Grid.Col>
              {mediaQuery ? (
                <Grid.Col xs={5} lg={5} offset={1}>
                  <Avatar
                    src={user.profileImage}
                    radius={'xl'}
                    classNames={{
                      image: classes.profileImage,
                      root: classes.avatar,
                    }}
                  />
                </Grid.Col>
              ) : null}
            </Grid>
          </Card>
        </Container>
        <Stack ml={'md'} mt={'md'}>
          <Title order={3} className={classes.title}>
            Sitater
          </Title>
          <UserQuotes quotes={user.taggedAndVerifiedQuotes} />
        </Stack>
      </Stack>
      <Stack justify={'flex-end'} mt={'xl'} ml={'xl'}>
        <Title order={3} className={classes.title}>
          Vervhistorikk
        </Title>
        <UserHistory memberships={memberships} />
      </Stack>
    </Group>
  )
}
