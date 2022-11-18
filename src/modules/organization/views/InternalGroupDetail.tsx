import { useQuery } from '@apollo/client'
import { Button, Card, Group, Image, Stack, Text, Title } from '@mantine/core'
import { Breadcrumbs } from 'components/Breadcrumbs'
import { FullPage404, FullPageError } from 'components/FullPageComponents'
import { FullContentLoader } from 'components/Loading/FullContentLoader'
import { PermissionGate } from 'components/PermissionGate'
import { UserThumbnail } from 'modules/users/components/UserThumbnail'
import { Link, useParams } from 'react-router-dom'
import { PERMISSIONS } from 'util/permissions'
import { INTERNAL_GROUP_QUERY } from '../queries'
import { InternalGroupReturns, InternalGroupVariables } from '../types'

const breadCrumbsItems = [
  {
    label: 'Hjem',
    path: '/dashboard',
  },
  {
    label: 'Interngjengene',
    path: '/internal-groups',
  },
]

interface InternalGroupDetailParams {
  internalGroupId: string
}

export const InternalGroupDetail: React.FC = () => {
  const { internalGroupId } = useParams<
    keyof InternalGroupDetailParams
  >() as InternalGroupDetailParams

  const { data, loading, error } = useQuery<
    InternalGroupReturns,
    InternalGroupVariables
  >(INTERNAL_GROUP_QUERY, {
    variables: { id: internalGroupId },
  })

  if (error) return <FullPageError />

  if (loading || !data) return <FullContentLoader />
  const { internalGroup } = data

  if (internalGroup === null) return <FullPage404 />

  const overloadedBreadcrumbs = [
    ...breadCrumbsItems,
    {
      label: internalGroup.name,
      path: '',
    },
  ]

  return (
    <Stack>
      <Breadcrumbs items={overloadedBreadcrumbs} />
      <Group position="apart">
        <Title>{internalGroup.name}</Title>
        <PermissionGate
          permissions={
            PERMISSIONS.organization.change.internalGroupPositionMembership
          }
        >
          <Link to="manage">
            <Button>Administrer medlemskap</Button>
          </Link>
        </PermissionGate>
      </Group>
      <Image src={internalGroup.groupImage ?? ''} />

      <Card>
        <Title order={2}>Beskrivelse av gjengen</Title>
        <Text>{internalGroup.description}</Text>
      </Card>
      {internalGroup.membershipData.map(position => (
        <>
          <Title order={3}>{position.internalGroupPositionName}</Title>
          <Group>
            {position.users.map(user => (
              <Stack>
                <UserThumbnail user={user} />
                <Text>{user.fullName}</Text>
              </Stack>
            ))}
          </Group>
        </>
      ))}
    </Stack>
  )
}
