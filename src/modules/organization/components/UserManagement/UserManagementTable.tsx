import { useMutation, useQuery } from '@apollo/client'
import { Badge, createStyles, Menu, Text, TextProps } from '@mantine/core'
import { CardTable } from 'components/CardTable'
import { InternalGroupPositionSelect } from 'components/Select/InternalGroupPositionSelect'
import { internalGroupPositionTypeOptions } from 'modules/organization/consts'
import { ASSIGN_NEW_INTERNAL_GROUP_POSITION_MEMBERSHIP } from 'modules/organization/mutations'
import { ALL_INTERNAL_GROUP_POSITIONS } from 'modules/organization/queries'
import { AllInternalGroupPositionsReturns } from 'modules/organization/types'
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
        {/* <Badge color={'samfundet-red'}>{membership.positionName}</Badge> */}
        <InternalGroupPositionSelect
          onChange={data => {
            if (!data) return
            handleAssignNewPosition(
              membership.userId,
              membership.internalGroupPositionType,
              data
            )
          }}
          variant="unstyled"
          value={membership.internalGroupPositionMembership.position.id}
        />
      </td>
      <td>
        <InternalGroupPositionTypeSelect
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
