import { useLazyQuery } from '@apollo/client'
import { Center, Loader, Table } from '@mantine/core'
import { useEffect } from 'react'
import styled from 'styled-components'
import { MANAGE_USERS_DATA_QUERY } from './queries'
import { ManageUsersDataReturns, ManageUsersDataVariables } from './types'
import { UserManagementTableRow } from './UserManagementTableRow'

const TableHeaderRow = styled.div`
  display: flex;
  flex-direction: row;
  font-size: 18px;
  font-weight: 600;
  gap: 10px;
`

interface UserManagementTableProps {
  activeOnly: boolean
  internalGroupId: string
}

export const UserManagementTable: React.VFC<UserManagementTableProps> = ({
  activeOnly,
  internalGroupId,
}) => {
  const [getUserData, { error, loading, data }] = useLazyQuery<
    ManageUsersDataReturns,
    ManageUsersDataVariables
  >(MANAGE_USERS_DATA_QUERY, {
    variables: {
      activeOnly: activeOnly,
      internalGroupId: internalGroupId,
    },
  })

  useEffect(() => {
    if (internalGroupId === '') return
    getUserData()
  }, [internalGroupId])

  const usersData = data?.manageUsersData ?? []

  const tableRows = usersData.map(membership => (
    <tr key={membership.userId}>
      <td>{membership.fullName}</td>
      <td>{membership.positionName}</td>
      <td>{membership.internalGroupPositionType}</td>
      <td>{membership.dateJoinedSemesterShorthand}</td>
      <UserManagementTableRow userData={membership} />
    </tr>
  ))

  return (
    <Table>
      {/* Should parse data in here and show loading state here */}
      <thead>
        <td>Navn</td>
        <td>Verv</td>
        <td>Type</td>
        <td>Startet</td>
        <td></td>
      </thead>
      <tbody>
        {loading ? (
          <Center>
            <Loader /> henter brukere
          </Center>
        ) : (
          tableRows
        )}
      </tbody>
    </Table>
  )
}
