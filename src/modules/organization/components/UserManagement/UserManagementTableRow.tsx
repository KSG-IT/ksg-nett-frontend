import { useMutation } from '@apollo/client'
import { ActionIcon, Menu } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { IconDots, IconGrave, IconTrash } from '@tabler/icons'
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
            <Menu.Item
              style={{ fontWeight: 800 }}
              color="samfundet-red"
              icon={<IconGrave size={20} stroke={2.4} />}
              onClick={handleQuitKSG}
            >
              Ferdig i KSG
            </Menu.Item>
            <Menu.Item
              color="samfundet-red.2"
              icon={<IconTrash size={20} stroke={2} />}
            >
              Fjern verv
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </td>
    </>
  )
}
