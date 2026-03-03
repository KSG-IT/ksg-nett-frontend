import { useQuery } from '@apollo/client'
import { Grid, Modal, Stack, Title } from '@mantine/core'
import { FullPage404, FullPageError } from 'components/FullPageComponents'
import { FullContentLoader } from 'components/Loading'
import { UserEditForm, UserHistory, UserQuotes } from 'modules/users/components'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { UserDetails } from '../components/UserDetails'

import { USER_QUERY } from '../queries'
import { UserQueryReturns, UserQueryVariables } from '../types'
import { createStyles } from '@mantine/emotion'

interface UserProfileParams {
  userId: string
}

export const UserProfile: React.FC = () => {
  const { classes } = useStyles()
  const [editUserModalOpen, setEditUserModalOpen] = useState(false)

  const { userId } = useParams<keyof UserProfileParams>() as UserProfileParams
  const { data, loading, error, refetch } = useQuery<
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

  if (user === null) return <FullPage404 />

  return (
    <>
      <Grid align={'flex-start'}>
        <Grid.Col span={{ base: 12, md: 12, lg: 9 }}>
          <UserDetails user={user} onClick={() => setEditUserModalOpen(true)} />
          <Stack mt={'xl'} className={classes.memberships}>
            <Title order={3} className={classes.title}>
              Sitater
            </Title>
            <UserQuotes quotes={user.taggedAndVerifiedQuotes} />
          </Stack>
        </Grid.Col>
        <Grid.Col span={'auto'}>
          <Stack mt={'md'}>
            <Title order={3} className={classes.title}>
              Vervhistorikk
            </Title>
            <UserHistory memberships={memberships} />
          </Stack>
        </Grid.Col>
        <Stack align={'flex-start'}></Stack>
      </Grid>
      <Modal
        opened={editUserModalOpen}
        onClose={() => setEditUserModalOpen(false)}
        title={
          <Title c={'dimmed'} order={3}>
            Rediger profilinfo
          </Title>
        }
        size="lg"
        padding="xl"
      >
        <UserEditForm
          user={fullUser}
          onCompletedCallback={() => setEditUserModalOpen(false)}
        />
      </Modal>
    </>
  )
}

const useStyles = createStyles((_theme, _, u) => ({
  title: {
    color: 'var(--mantine-color-gray-6)',
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
    fontFamily: `Greycliff CF, var(--mantine-font-family)`,
    fontWeight: 500,
    fontSize: ('var(--mantine-font-size-lg)' as unknown as number) * 1.25, // Shady ??
    [u.smallerThan('md')]: {
      textAlign: 'center',
    },
  },
  role: {
    color: 'var(--mantine-color-gray-7)',
    fontWeight: 700,
    textTransform: 'uppercase',
    fontSize: 'var(--mantine-font-size-lg)',
    [u.smallerThan('md')]: {
      textAlign: 'center',
    },
  },
  aboutMe: {
    color: 'var(--mantine-color-gray-7)',
    fontWeight: 700,
    textTransform: 'uppercase',
    fontSize: 'var(--mantine-font-size-lg)',
    [u.smallerThan('md')]: {
      textAlign: 'center',
    },
  },
  container: {
    // Media query with value from theme
    [u.smallerThan('md')]: {
      marginLeft: 0,
      marginRight: 0,
    },
  },
  wrapper: {
    [u.smallerThan('md')]: {
      marginLeft: 0,
      marginRight: 0,
    },
    marginTop: 'var(--mantine-spacing-md)',
  },
  card: {
    width: '70%',
  },
  memberships: {},
  bio: {
    minWidth: 412,
    minHeight: 74,
  },
}))
