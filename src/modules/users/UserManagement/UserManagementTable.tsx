import { Badge, createStyles, Table, Text, TextProps } from '@mantine/core'
import { ManageInternalGroupUser } from './types'
import { UserManagementTableRow } from './UserManagementTableRow'
import { getInternalGroupPositionTypeLabel } from './util'

interface UserManagementTableProps {
  usersData: ManageInternalGroupUser[]
}

const useStyles = createStyles(theme => ({
  card: {
    backgroundColor: theme.colors.white,
    borderTop: `5px solid ${theme.colors.brand}`,
  },
  tableHeader: {
    color: theme.colors.gray[7],
    textTransform: 'uppercase',
  },
  headerRow: {
    borderRadius: theme.radius.xs,
  },
}))

export const UserManagementTable: React.FC<UserManagementTableProps> = ({
  usersData,
}) => {
  const { classes } = useStyles()
  const TableData: React.FC<TextProps> = ({ children, color, weight }) => (
    <td>
      <Text color={color} weight={weight} size={'sm'}>
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
        {getInternalGroupPositionTypeLabel(
          membership.internalGroupPositionType
        )}
      </TableData>
      <TableData>{membership.dateJoinedSemesterShorthand}</TableData>
      <UserManagementTableRow userData={membership} />
    </tr>
  ))
  const Header: React.FC<TextProps> = ({ children, align }) => (
    <th>
      <Text
        align={align}
        weight={800}
        size={'sm'}
        className={classes.tableHeader}
      >
        {children}
      </Text>
    </th>
  )

  return (
    <Table>
      {/* Should parse data in here and show loading state here */}
      <thead>
        <tr>
          <Header>Navn</Header>
          <Header align="center">Stilling</Header>
          <Header>Gruppe</Header>
          <Header>Startet</Header>
          <Header>Sett verv</Header>
        </tr>
      </thead>
      <tbody>{tableRows}</tbody>
    </Table>
  )
}
