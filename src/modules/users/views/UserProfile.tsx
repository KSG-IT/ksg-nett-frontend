import { useQuery } from '@apollo/client'
import {
  Button,
  createStyles,
  Grid,
  Group,
  Modal,
  Stack,
  Title,
} from '@mantine/core'
import { FullPage404, FullPageError } from 'components/FullPageComponents'
import { FullContentLoader } from 'components/Loading'
import { PermissionGate } from 'components/PermissionGate'
import { UserEditForm, UserHistory, UserQuotes } from 'modules/users/components'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useMediaQuery } from 'util/hooks'
import { PERMISSIONS } from 'util/permissions'
import { UserDetails } from '../components/UserDetails'

import { USER_QUERY } from '../queries'
import { UserQueryReturns, UserQueryVariables } from '../types'

interface UserProfileParams {
  userId: string
}

export const UserProfile: React.FC = () => {
  const { classes } = useStyles()
  const isMobile = useMediaQuery('(max-width: 800px)')
  const [editUserModalOpen, setEditUserModalOpen] = useState(false)

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

  const editButton = (
    <PermissionGate permissions={PERMISSIONS.users.change.user}>
      <Button
        variant="light"
        color={'samfundet-red'}
        onClick={() => setEditUserModalOpen(true)}
      >
        Endre
      </Button>
    </PermissionGate>
  )

  return (
    <>
      <Grid align={'flex-start'}>
        <Grid.Col md={12} lg={9}>
          <UserDetails user={user} onClick={() => setEditUserModalOpen(true)} />
          <Stack mt={'xl'} className={classes.memberships}>
            <Title order={3} className={classes.title}>
              Sitater
            </Title>
            <UserQuotes quotes={user.taggedAndVerifiedQuotes} />
          </Stack>
        </Grid.Col>
        <Grid.Col span={'auto'}>
          <Stack ml={'lg'} mt={'md'}>
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
          <Title color={'dimmed'} order={3}>
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
    width: '70%',
  },
  memberships: {},
  bio: {
    minWidth: 412,
    minHeight: 74,
  },
}))
