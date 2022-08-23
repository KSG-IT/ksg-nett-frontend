import { Table } from '@mantine/core'
import { ManageInternalGroupUser } from './types'
import { UserManagementTableRow } from './UserManagementTableRow'

interface UserManagementTableProps {
  usersData: ManageInternalGroupUser[]
}

export const UserManagementTable: React.VFC<UserManagementTableProps> = ({
  usersData,
}) => {
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
      <tbody>{tableRows}</tbody>
    </Table>
  )
}
