import { useQuery } from '@apollo/client'
import { Button, Group, Stack, Title } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { Breadcrumbs } from 'components/Breadcrumbs'
import { CardTable } from 'components/CardTable'
import { FullPageError } from 'components/FullPageComponents'
import { FullContentLoader } from 'components/Loading'
import { MessageBox } from 'components/MessageBox'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { DetailQueryVariables } from 'types/graphql'
import { format } from 'util/date-fns'
import { AddUserToUserTypeModal } from '../components/UserTypeDetail'
import { useUserTypeMutations } from '../mutations.hooks'
import { USER_TYPE_DETAIL_QUERY } from '../queries'
import { UserTypeDetailQueryReturns } from '../types'

const breadcrumbsItems = [
  { label: 'Hjem', path: '/dashboard' },
  { label: 'Tilganger', path: '/users/user-types' },
]

type UserTypeDetailParams = {
  userTypeId: string
}
export const UserTypeDetail: React.FC = ({}) => {
  const { userTypeId } = useParams<
    keyof UserTypeDetailParams
  >() as UserTypeDetailParams

  const [addUserModalOpen, setAddUserModalOpen] = useState(false)

  const { removeUserFromUserType, removeUserFromUserTypeLoading } =
    useUserTypeMutations()

  const { data, loading, error } = useQuery<
    UserTypeDetailQueryReturns,
    DetailQueryVariables
  >(USER_TYPE_DETAIL_QUERY, {
    variables: {
      id: userTypeId,
    },
  })

  if (error) return <FullPageError />

  if (loading || !data) return <FullContentLoader />

  const { userType } = data

  function handleRemoveUserFromUserType(userId: string) {
    removeUserFromUserType({
      variables: {
        userTypeId: userTypeId,
        userId: userId,
      },
      refetchQueries: [USER_TYPE_DETAIL_QUERY],
      onCompleted() {
        showNotification({
          title: 'Bruker fjernet',
          message: 'Brukeren ble fjernet fra gruppen',
          color: 'green',
        })
      },
      onError() {
        showNotification({
          title: 'Noe gikk galt',
          message: 'Kunne ikke fjerne bruker fra gruppe',
          color: 'red',
        })
      },
    })
  }

  const userRows = userType.users.map(user => (
    <tr>
      <td>{user.getCleanFullName}</td>
      <td>
        <Group position="right">
          <Button
            color="samfundet-red"
            onClick={() => handleRemoveUserFromUserType(user.id)}
          >
            Fjern fra gruppe
          </Button>
        </Group>
      </td>
    </tr>
  ))

  const changelogRows = userType.changelog.map(logEntry => (
    <tr>
      <td>{format(new Date(logEntry.timestamp), 'yyyy.MM.dd HH:mm:ss')}</td>
      <td>{logEntry.user.getCleanFullName}</td>
      <td>{logEntry.doneBy.getCleanFullName}</td>
      <td>{logEntry.action}</td>
    </tr>
  ))

  const overloadedBreadcrumbItems = [
    ...breadcrumbsItems,
    { label: userType.name, path: `/users/user-types/${userType.id}` },
  ]
  return (
    <Stack>
      <Breadcrumbs items={overloadedBreadcrumbItems} />
      <Group position="apart">
        <Title>{userType.name}</Title>
        <Button color="samfundet-red" onClick={() => setAddUserModalOpen(true)}>
          Legg til bruker
        </Button>
      </Group>
      {userType.description && (
        <MessageBox type="info">{userType.description}</MessageBox>
      )}

      <Title order={2}>Aktive medlemskap</Title>
      <CardTable>
        <thead>
          <tr>
            <th>Navn</th>
            <th></th>
          </tr>
        </thead>
        <tbody>{userRows}</tbody>
      </CardTable>

      <Title order={2}>Endringslogg</Title>
      <CardTable>
        <thead>
          <tr>
            <th>Tidsstempel</th>
            <th>Bruker</th>
            <th>Gjort av</th>
            <th>Handling</th>
          </tr>
        </thead>
        <tbody>{changelogRows}</tbody>
      </CardTable>
      <AddUserToUserTypeModal
        userTypeId={userType.id}
        opened={addUserModalOpen}
        onClose={() => setAddUserModalOpen(false)}
      />
    </Stack>
  )
}
