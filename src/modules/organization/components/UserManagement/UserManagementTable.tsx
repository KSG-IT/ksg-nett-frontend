import { Badge, Text } from '@mantine/core'
import { CardTable } from 'components/CardTable'
import { ManageInternalGroupUser } from 'modules/organization/types.graphql'
import { UserManagementTableRow } from './UserManagementTableRow'
import { createStyles } from '@mantine/emotion'

interface UserManagementTableProps {
  usersData: ManageInternalGroupUser[]
  activeMemberships?: boolean
}

const useStyles = createStyles({
  card: {
    backgroundColor: 'white',
    borderTop: '5px solid var(--mantine-color-brand-6)',
  },
  tableHeader: {
    color: 'var(--mantine-color-gray-7)',
    textTransform: 'uppercase',
  },
  headerRow: {
    borderRadius: 'var(--mantine-radius-xs)',
  },
})

export const UserManagementTable: React.FC<UserManagementTableProps> = ({
  usersData,
  activeMemberships = false,
}) => {
  const { classes } = useStyles()
  const TableData: React.FC<{
    children?: React.ReactNode
    color?: string
    fw?: number
  }> = ({ children, color, fw }) => (
    <td>
      <Text c={color} fw={fw} size={'sm'}>
        {children}
      </Text>
    </td>
  )

  const tableRows = usersData.map(membership => (
    <tr key={membership.userId}>
      <TableData>{membership.fullName}</TableData>
      <td align="center">
        <Badge color={'samfundet-red'}>{membership.positionName}</Badge>
      </td>
      <TableData>
        {membership.internalGroupPositionMembership.getTypeDisplay}
      </TableData>
      <TableData>{membership.dateJoinedSemesterShorthand}</TableData>
      {activeMemberships ? (
        <UserManagementTableRow userData={membership} />
      ) : (
        <td>{membership.dateEndedSemesterShorthand}</td>
      )}
    </tr>
  ))
  const Header: React.FC<{
    children?: React.ReactNode
    ta?: 'left' | 'center' | 'right'
  }> = ({ children, ta }) => (
    <th>
      <Text ta={ta} fw={800} size={'sm'} className={classes.tableHeader}>
        {children}
      </Text>
    </th>
  )

  return (
    <CardTable>
      {/* Should parse data in here and show loading state here */}
      <thead>
        <tr>
          <Header>Navn</Header>
          <Header ta="center">Stilling</Header>
          <Header>Gruppe</Header>
          <Header>Startet</Header>
          {activeMemberships ? (
            <>
              <Header>Sett verv</Header>
              <th></th>
              <th></th>
            </>
          ) : (
            <Header>Sluttet</Header>
          )}
        </tr>
      </thead>
      <tbody>{tableRows}</tbody>
    </CardTable>
  )
}
