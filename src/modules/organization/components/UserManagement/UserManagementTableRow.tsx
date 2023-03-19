import { useMutation } from '@apollo/client'
import { ActionIcon, Menu } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import {
  IconAlertTriangle,
  IconDots,
  IconMessages,
  IconNote,
  IconTrash,
} from '@tabler/icons'
import { internalGroupPositionTypeOptions } from 'modules/organization/consts'
import { ASSIGN_NEW_INTERNAL_GROUP_POSITION_MEMBERSHIP } from 'modules/organization/mutations'
import { useInternalGroupPositionMembershipMutations } from 'modules/organization/mutations.hooks'
import {
  AssignNewInternalGroupPositionMembershipReturns,
  AssignNewInternalGroupPositionMembershipVariables,
  InternalGroupPositionTypeOption,
  ManageInternalGroupUser,
} from 'modules/organization/types.graphql'
import { MANAGE_USERS_DATA_QUERY } from 'modules/users/queries'
import { useState } from 'react'
import toast from 'react-hot-toast'

interface UserManagementTableRowProp {
  userData: ManageInternalGroupUser
}

export const UserManagementTableRow: React.FC<UserManagementTableRowProp> = ({
  userData,
}) => {
  const [
    selectedInternalGroupPositionType,
    setSelectedInternalGroupPositionType,
  ] = useState<InternalGroupPositionTypeOption | null>(null)
  const [assignNewPosition, { loading }] = useMutation<
    AssignNewInternalGroupPositionMembershipReturns,
    AssignNewInternalGroupPositionMembershipVariables
  >(ASSIGN_NEW_INTERNAL_GROUP_POSITION_MEMBERSHIP, {
    refetchQueries: ['ManageUsersDataQuery'],
  })

  const { patchInternalGroupPositionMembership, quitKSG } =
    useInternalGroupPositionMembershipMutations()

  const handleAssignNewPosition = () => {
    if (selectedInternalGroupPositionType === null) return

    if (
      selectedInternalGroupPositionType.value ===
      userData.internalGroupPositionType
    )
      return

    assignNewPosition({
      variables: {
        userId: userData.userId,
        internalGroupPositionId:
          userData.internalGroupPositionMembership.position.id,
        internalGroupPositionType: selectedInternalGroupPositionType.value,
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

  function handleQuitKSG() {
    const confirmed = confirm('Er du sikker på at du vil gjør dette?')

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

  return (
    <>
      <td>
        <Menu transition="pop" withArrow position="bottom-end">
          <Menu.Target>
            <ActionIcon>
              <IconDots size={16} stroke={1.5} />
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item color="red" icon={<IconTrash size={16} stroke={1.5} />}>
              Slett verv
            </Menu.Item>
            <Menu.Item
              color="orange"
              icon={<IconAlertTriangle size={16} stroke={1.5} />}
              onClick={handleQuitKSG}
            >
              Ferdig i KSG
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </td>
    </>
  )
}
