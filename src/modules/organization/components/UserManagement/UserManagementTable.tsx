import { useMutation } from '@apollo/client'
import { Badge, Text, TextProps, createStyles } from '@mantine/core'
import { CardTable } from 'components/CardTable'
import { ASSIGN_NEW_INTERNAL_GROUP_POSITION_MEMBERSHIP } from 'modules/organization/mutations'
import {
  AssignNewInternalGroupPositionMembershipReturns,
  AssignNewInternalGroupPositionMembershipVariables,
  InternalGroupPositionType,
  ManageInternalGroupUser,
} from 'modules/organization/types.graphql'
import { MANAGE_USERS_DATA_QUERY } from 'modules/users/queries'
import toast from 'react-hot-toast'
import { InternalGroupPositionTypeSelect } from './InternalGroupPositionTypeSelect'
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
const TableData: React.FC<TextProps> = ({ children, color, weight }) => (
  <td>
    <Text color={color} weight={weight} size={'sm'}>
      {children}
    </Text>
  </td>
)

export const UserManagementTable: React.FC<UserManagementTableProps> = ({
  usersData,
  activeMemberships = false,
}) => {
  const { classes } = useStyles()
  const [assignNewPosition, { loading }] = useMutation<
    AssignNewInternalGroupPositionMembershipReturns,
    AssignNewInternalGroupPositionMembershipVariables
  >(ASSIGN_NEW_INTERNAL_GROUP_POSITION_MEMBERSHIP, {
    refetchQueries: ['ManageUsersDataQuery'],
  })

  const handleAssignNewPosition = (
    userId: string,
    positionType: InternalGroupPositionType,
    positionId: string
  ) => {
    assignNewPosition({
      variables: {
        userId: userId,
        internalGroupPositionId: positionId,
        internalGroupPositionType: positionType,
      },
      refetchQueries: [MANAGE_USERS_DATA_QUERY],
      onError() {
        toast.error('Noe gikk galt')
      },
      onCompleted() {
        toast.success('Bruker oppdatert!')
      },
    })
  }

  const tableRows = usersData.map(membership => (
    <tr key={membership.userId}>
      <TableData>{membership.fullName}</TableData>
      <td align="center">
        <Badge onClick={() => alert('hei')} color={'samfundet-red'}>
          {membership.positionName}
        </Badge>
      </td>
      <td>
        <InternalGroupPositionTypeSelect
          withinPortal
          style={{ width: 'fit-content' }}
          onChange={data => {
            if (
              data &&
              Object.values(InternalGroupPositionType).includes(
                data as InternalGroupPositionType
              )
            ) {
              handleAssignNewPosition(
                membership.userId,
                data as InternalGroupPositionType,
                membership.internalGroupPositionMembership.position.id
              )
            }
          }}
          variant="unstyled"
          value={membership.internalGroupPositionType}
        />
      </td>
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
