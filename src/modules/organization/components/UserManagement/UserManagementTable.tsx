import { useMutation } from '@apollo/client'
import { Text, TextProps, createStyles } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { IconChevronDown } from '@tabler/icons-react'
import { CardTable } from 'components/CardTable'
import { ASSIGN_NEW_INTERNAL_GROUP_POSITION_MEMBERSHIP } from 'modules/organization/mutations'
import {
  AssignNewInternalGroupPositionMembershipReturns,
  AssignNewInternalGroupPositionMembershipVariables,
  InternalGroupPositionType,
  ManageInternalGroupUser,
} from 'modules/organization/types.graphql'
import { MANAGE_USERS_DATA_QUERY } from 'modules/users/queries'
import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { InternalGroupMembershipDate } from './InternalGroupMembershipDate'
import { InternalGroupPositionByInternalGroupSelect } from './InternalGroupPositionSelect'
import { InternalGroupPositionTypeSelect } from './InternalGroupPositionTypeSelect'
import { UserManagementTableRow } from './UserManagementTableRow'

interface UserManagementTableProps {
  usersData: ManageInternalGroupUser[]
  activeMemberships?: boolean
  internalGroupId: string
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
  positionSelect: {
    color: theme.colors['samfundet-red'][6],
    backgroundColor: theme.colors['samfundet-red'][0],
    fontWeight: 'bold',
    borderRadius: theme.radius.lg,
    textAlign: 'start',
    paddingLeft: 12,
    textOverflow: 'ellipsis',
  },
  positionSelectRightSection: {
    color: theme.colors['samfundet-red'][6],
    pointerEvents: 'none',
  },
  positionSelectRoot: {
    paddingLeft: 12,
    width: 'fit-content',
    maxWidth: 200,
  },
  tableBody: {
    '& td': {
      minWidth: 'max-content',
    },
  },
}))

type TableDataProps = TextProps & {
  onClick?: () => void
}
const TableData: React.FC<TableDataProps> = ({
  children,
  color,
  weight,
  ...props
}) => (
  <td>
    <Text
      color={color}
      weight={weight}
      size={'sm'}
      style={{ cursor: 'pointer' }}
      {...props}
    >
      {children}
    </Text>
  </td>
)

export const UserManagementTable: React.FC<UserManagementTableProps> = ({
  usersData,
  activeMemberships = false,
  internalGroupId,
}) => {
  const { classes } = useStyles()
  const navigate = useNavigate()
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
        showNotification({
          title: 'Feil',
          message: 'Noe gikk galt',
          color: 'red',
        })
      },
      onCompleted() {
        showNotification({
          title: 'Suksess',
          message: 'Brukeren har fått nytt verv',
          color: 'green',
        })
      },
    })
  }

  function handleNavigateToUserPage(userId: string) {
    navigate(`/users/${userId}`)
  }

  const handleSelectPosition = (
    data: string,
    membership: ManageInternalGroupUser
  ) => {
    handleAssignNewPosition(
      membership.userId,
      membership.internalGroupPositionType,
      data
    )
  }

  const handleSelectPositionType = (
    data: InternalGroupPositionType,
    membership: ManageInternalGroupUser
  ) => {
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
  }

  const tableRows = useMemo(
    () =>
      usersData.map(membership => (
        <tr key={membership.userId}>
          <TableData
            onClick={() => handleNavigateToUserPage(membership.userId)}
          >
            {membership.fullName}
          </TableData>
          <td align="center">
            <InternalGroupPositionByInternalGroupSelect
              rightSection={<IconChevronDown size="1rem" />}
              variant="unstyled"
              classNames={{
                input: classes.positionSelect,
                rightSection: classes.positionSelectRightSection,
                root: classes.positionSelectRoot,
              }}
              value={membership.internalGroupPositionMembership.position.id}
              internalGroupId={internalGroupId}
              onChange={data => handleSelectPosition(data, membership)}
            />
          </td>
          <td align="center">
            <InternalGroupPositionTypeSelect
              withinPortal
              style={{ width: 'fit-content' }}
              onChange={data => handleSelectPositionType(data, membership)}
              variant="unstyled"
              value={membership.internalGroupPositionType}
            />
          </td>
          <td align="center">
            <InternalGroupMembershipDate
              membership={membership}
              activeMemberships={activeMemberships}
            />
          </td>
          {activeMemberships ? (
            <UserManagementTableRow userData={membership} />
          ) : (
            <UserManagementTableRow userData={membership} />
          )}
        </tr>
      )),
    [usersData, handleNavigateToUserPage]
  )
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
          <Header align="center">Gruppe</Header>
          <Header align="center">
            {activeMemberships ? 'Medlem siden' : 'Vervperiode'}
          </Header>
          <Header></Header>
        </tr>
      </thead>
      <tbody className={classes.tableBody}>{tableRows}</tbody>
    </CardTable>
  )
}
