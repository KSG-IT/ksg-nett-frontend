import { useQuery } from '@apollo/client'
import { Button, Group, Stack, Title } from '@mantine/core'
import { CardTable } from 'components/CardTable'
import { FullPageError } from 'components/FullPageComponents'
import { FullContentLoader } from 'components/Loading'
import { MessageBox } from 'components/MessageBox'
import { Link } from 'react-router-dom'
import { ALL_USER_TYPES_QUERY } from '../queries'
import { AllUserTypesQueryReturns } from '../types'

export const UserTypes: React.FC = () => {
  const { data, loading, error } =
    useQuery<AllUserTypesQueryReturns>(ALL_USER_TYPES_QUERY)

  if (error) return <FullPageError />

  if (loading || !data) return <FullContentLoader />

  const rows = data.allUserTypes.map(userType => (
    <tr id={`${userType.id}`}>
      <td>{userType.name}</td>
      <td>
        <Group position="right">
          <Link to={`${userType.id}`}>
            <Button color="samfundet-red">Administrer</Button>
          </Link>
        </Group>
      </td>
    </tr>
  ))
  return (
    <Stack>
      <Title>Tilganger</Title>
      <MessageBox type="info">
        Her har du mulighet til å se de forskjellige brukertypene som er
        tilgjengelig i KSG-nett.
      </MessageBox>

      <CardTable>
        <thead>
          <tr>
            <th>Navn</th>
            <th></th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </CardTable>
    </Stack>
  )
}
