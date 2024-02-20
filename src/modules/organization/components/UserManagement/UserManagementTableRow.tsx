import { useMutation } from '@apollo/client'
import { ActionIcon, Menu, createStyles } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { IconDots, IconGrave, IconTrash } from '@tabler/icons-react'
import { ASSIGN_NEW_INTERNAL_GROUP_POSITION_MEMBERSHIP } from 'modules/organization/mutations'
import { useInternalGroupPositionMembershipMutations } from 'modules/organization/mutations.hooks'
import {
  AssignNewInternalGroupPositionMembershipReturns,
  AssignNewInternalGroupPositionMembershipVariables,
  InternalGroupPositionType,
  ManageInternalGroupUser,
} from 'modules/organization/types.graphql'
import { MANAGE_USERS_DATA_QUERY } from 'modules/users/queries'
import { useState } from 'react'

interface UserManagementTableRowProp {
  userData: ManageInternalGroupUser
}

const useStyles = createStyles(theme => ({
  menuOption: {
    fontSize: theme.fontSizes.xs,
    color: theme.colors['samfundet-red'][6],
  },
}))

export const UserManagementTableRow: React.FC<UserManagementTableRowProp> = ({
  userData,
}) => {
  const [
    selectedInternalGroupPositionType,
    setSelectedInternalGroupPositionType,
  ] = useState<InternalGroupPositionType | null>(null)
  const [assignNewPosition, { loading }] = useMutation<
    AssignNewInternalGroupPositionMembershipReturns,
    AssignNewInternalGroupPositionMembershipVariables
  >(ASSIGN_NEW_INTERNAL_GROUP_POSITION_MEMBERSHIP, {
    refetchQueries: ['ManageUsersDataQuery'],
  })

  const { classes } = useStyles()

  const { quitKSG, deleteInternalGroupPositionMembership, removeMember } =
    useInternalGroupPositionMembershipMutations()

  const handleAssignNewPosition = () => {
    if (selectedInternalGroupPositionType === null) return

    if (
      selectedInternalGroupPositionType === userData.internalGroupPositionType
    )
      return

    assignNewPosition({
      variables: {
        userId: userData.userId,
        internalGroupPositionId:
          userData.internalGroupPositionMembership.position.id,
        internalGroupPositionType: selectedInternalGroupPositionType,
      },
      refetchQueries: [MANAGE_USERS_DATA_QUERY],
      onCompleted() {
        showNotification({
          title: 'Suksess',
          message: 'Brukeren har fått nytt verv',
          color: 'green',
        })
      },
      onError({ message }) {
        showNotification({
          title: 'Noe gikk galt',
          message,
          color: 'red',
        })
      },
    })
  }

  function handleQuitKSG() {
    const confirmed = confirm('Er du sikker på at du vil avslutte vervet?')

    if (!confirmed) return

    quitKSG({
      variables: {
        membershipId: userData.internalGroupPositionMembership.id,
      },
      refetchQueries: [MANAGE_USERS_DATA_QUERY],
      onCompleted() {
        showNotification({
          title: 'Suksess',
          message: 'Avsluttet verv i KSG',
        })
      },
      onError({ message }) {
        showNotification({
          title: 'Noe gikk galt',
          message,
        })
      },
    })
  }

  const handleRemovePosition = () => {
    const confirmed = confirm('Er du sikker på at du vil fjerne vervet?')

    if (!confirmed) return

    removeMember({
      variables: {
        id: userData.internalGroupPositionMembership.id,
      },
      refetchQueries: [MANAGE_USERS_DATA_QUERY],
      onCompleted() {
        showNotification({
          title: 'Suksess',
          message: 'Fjernet verv',
        })
      },
      onError({ message }) {
        showNotification({
          title: 'Noe gikk galt',
          message,
        })
      },
    })
  }

  return (
    <>
      <td>
        <Menu withArrow position="bottom-end">
          <Menu.Target>
            <ActionIcon>
              <IconDots />
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item
              fw={'bold'}
              className={classes.menuOption}
              icon={<IconGrave size={16} />}
              onClick={handleQuitKSG}
            >
              Ferdig i KSG
            </Menu.Item>
            <Menu.Item
              className={classes.menuOption}
              icon={<IconTrash size={16} />}
              onClick={handleRemovePosition}
            >
              Fjern verv
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </td>
    </>
  )
}
