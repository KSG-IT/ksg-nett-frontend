import { useMutation } from '@apollo/client'
import { Button, Group } from '@mantine/core'
import { useInternalGroupPositionMembershipMutations } from 'modules/organization/mutations.hooks'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { MANAGE_USERS_DATA_QUERY } from '../queries'
import { InternalGroupPositionTypeSelect } from './InternalGroupPositionTypeSelect'
import { ASSIGN_NEW_INTERNAL_GROUP_POSITION_MEMBERSHIP } from './mutations'
import {
  AssignNewInternalGroupPositionMembershipReturns,
  AssignNewInternalGroupPositionMembershipVariables,
  InternalGroupPositionTypeOption,
  ManageInternalGroupUser,
} from './types'

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
    quitKSG({
      variables: {
        membershipId: userData.internalGroupPositionMembership.id,
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
