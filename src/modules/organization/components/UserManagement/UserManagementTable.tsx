import { Table, Text } from '@mantine/core'
import { Badge } from 'components/Badge'
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
    borderTop: '5px solid var(--mantine-color-samfundet-red-7)',
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
    <Table.Td>
      <Text c={color} fw={fw} size={'sm'}>
        {children}
      </Text>
    </Table.Td>
  )

  const tableRows = usersData.map(membership => (
    <Table.Tr key={membership.userId}>
      <TableData>{membership.fullName}</TableData>
      <Table.Td align="center">
        <Badge color={'samfundet-red'}>{membership.positionName}</Badge>
      </Table.Td>
      <TableData>
        {membership.internalGroupPositionMembership.getTypeDisplay}
      </TableData>
      <TableData>{membership.dateJoinedSemesterShorthand}</TableData>
      {activeMemberships ? (
        <UserManagementTableRow userData={membership} />
      ) : (
        <Table.Td>{membership.dateEndedSemesterShorthand}</Table.Td>
      )}
    </Table.Tr>
  ))
  const Header: React.FC<{
    children?: React.ReactNode
    ta?: 'left' | 'center' | 'right'
  }> = ({ children, ta }) => (
    <Table.Th>
      <Text ta={ta} fw={800} size={'sm'} className={classes.tableHeader}>
        {children}
      </Text>
    </Table.Th>
  )

  return (
    <CardTable>
      {/* Should parse data in here and show loading state here */}
      <Table.Thead>
        <Table.Tr>
          <Header>Navn</Header>
          <Header ta="center">Stilling</Header>
          <Header>Gruppe</Header>
          <Header>Startet</Header>
          {activeMemberships ? (
            <>
              <Header>Sett verv</Header>
              <Table.Th></Table.Th>
              <Table.Th></Table.Th>
            </>
          ) : (
            <Header>Sluttet</Header>
          )}
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>{tableRows}</Table.Tbody>
    </CardTable>
  )
}
