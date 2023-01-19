import { Badge, createStyles, Menu, Text, TextProps } from '@mantine/core'
import { CardTable } from 'components/CardTable'
import { internalGroupPositionTypeOptions } from 'modules/organization/consts'
import { ManageInternalGroupUser } from 'modules/organization/types.graphql'
import { UserManagementTableRow } from './UserManagementTableRow'

interface UserManagementTableProps {
  usersData: ManageInternalGroupUser[]
  activeMemberships?: boolean
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
  activeMemberships = false,
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
        <Menu>
          <Menu.Target>
            <Badge style={{ cursor: 'pointer' }}>
              {membership.internalGroupPositionMembership.getTypeDisplay}
            </Badge>
          </Menu.Target>
          <Menu.Dropdown>
            {internalGroupPositionTypeOptions.map(positionType => (
              <Menu.Item>{positionType.label}</Menu.Item>
            ))}
          </Menu.Dropdown>
        </Menu>
      </TableData>
      <TableData>{membership.dateJoinedSemesterShorthand}</TableData>
      {activeMemberships ? (
        <UserManagementTableRow userData={membership} />
      ) : (
        <td>{membership.dateEndedSemesterShorthand}</td>
      )}
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
    <CardTable compact>
      {/* Should parse data in here and show loading state here */}
      <thead>
        <tr>
          <Header>Navn</Header>
          <Header align="center">Stilling</Header>
          <Header>Gruppe</Header>
          <Header>Startet</Header>
          {activeMemberships ? (
            <>
              <Header></Header>
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
