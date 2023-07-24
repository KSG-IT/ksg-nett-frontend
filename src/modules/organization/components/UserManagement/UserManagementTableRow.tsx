import { useMutation } from '@apollo/client'
import { Button, Group } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { ASSIGN_NEW_INTERNAL_GROUP_POSITION_MEMBERSHIP } from 'modules/organization/mutations'
import { useInternalGroupPositionMembershipMutations } from 'modules/organization/mutations.hooks'
import {
  AssignNewInternalGroupPositionMembershipReturns,
  AssignNewInternalGroupPositionMembershipVariables,
  InternalGroupPositionTypeOption,
  ManageInternalGroupUser,
} from 'modules/organization/types.graphql'
import { useState } from 'react'
import { MANAGE_USERS_DATA_QUERY } from '../../../users/queries'
import { InternalGroupPositionTypeSelect } from './InternalGroupPositionTypeSelect'

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

  const { quitKSG } = useInternalGroupPositionMembershipMutations()

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
    quitKSG({
      variables: {
        membershipId: userData.internalGroupPositionMembership.id,
      },
      refetchQueries: [MANAGE_USERS_DATA_QUERY],
      onCompleted() {
        showNotification({
          title: 'Suksess',
          message: 'Snakkes aldri',
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

  return (
    <>
      <td>
        <InternalGroupPositionTypeSelect
          onChange={setSelectedInternalGroupPositionType}
          selected={selectedInternalGroupPositionType}
        />
      </td>
      <td>
        <Group>
          <Button
            color={'samfundet-red'}
            onClick={() => {
              handleAssignNewPosition()
            }}
            disabled={loading}
          >
            Oppdater status
          </Button>
          <Button
            variant="outline"
            color="samfundet-red"
            onClick={handleQuitKSG}
          >
            Ferdig med KSG
          </Button>
        </Group>
      </td>
    </>
  )
}
