import { useLazyQuery } from '@apollo/client'
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

const TableHeaderCell = styled.div``

const TableRow = styled.div`
  display: flex;
  flex-direction: row;
  font-size: 16px;
  font-weight: 400;
  gap: 10px;
  height: 35px;
  align-items: center;
`

const Table = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  background-color: ${props => props.theme.colors.white};
`

const TableCell = styled.div`
  font-size: 16px;
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
  return (
    <Table>
      {/* Should parse data in here and show loading state here */}
      <TableHeaderRow>
        <TableHeaderCell>Navn</TableHeaderCell>
        <TableHeaderCell>Verv</TableHeaderCell>
        <TableHeaderCell>Type</TableHeaderCell>
        <TableHeaderCell>Startet</TableHeaderCell>
        <TableHeaderCell></TableHeaderCell>
      </TableHeaderRow>

      {loading ? (
        <span>Henter brukere...</span>
      ) : (
        usersData.map(userData => (
          <TableRow>
            <TableCell>{userData.fullName}</TableCell>
            <TableCell>{userData.positionName}</TableCell>
            <TableCell>{userData.internalGroupPositionType}</TableCell>
            <TableCell>{userData.dateJoinedSemesterShorthand}</TableCell>
            <UserManagementTableRow userData={userData} />
          </TableRow>
        ))
      )}
    </Table>
  )
}
