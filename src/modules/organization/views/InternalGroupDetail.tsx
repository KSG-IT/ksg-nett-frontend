import { useQuery } from '@apollo/client'
import { Button, Group, Image, Stack, Title } from '@mantine/core'
import { Breadcrumbs } from 'components/Breadcrumbs'
import { FullPage404, FullPageError } from 'components/FullPageComponents'
import { FullContentLoader } from 'components/Loading/FullContentLoader'
import { PermissionGate } from 'components/PermissionGate'
import { Link, useParams } from 'react-router-dom'
import { PERMISSIONS } from 'util/permissions'
import { InternalGroupTabs } from '../components/InternalGroupDetail'
import { INTERNAL_GROUP_QUERY } from '../queries'
import { InternalGroupReturns, InternalGroupVariables } from '../types'
import { createStyles } from '@mantine/emotion'

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
  const { classes } = useStyles()
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
      {internalGroup.groupImage && (
        <Image className={classes.banner} src={internalGroup.groupImage} />
      )}
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
      <InternalGroupTabs internalGroup={internalGroup} />
    </Stack>
  )
}

const useStyles = createStyles(() => ({
  banner: {
    minHeight: 200,
    maxHeight: 250,
    width: '100%',
    borderRadius: '10px 10px 0 0',
    overflow: 'clip',
  },
}))
