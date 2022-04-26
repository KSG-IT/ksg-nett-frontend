import { useMutation } from '@apollo/client'
import { Button } from '@mantine/core'
import { useState } from 'react'
import toast from 'react-hot-toast'
import styled from 'styled-components'
import { InternalGroupPositionTypeSelect } from './InternalGroupPositionTypeSelect'
import { ASSIGN_NEW_INTERNAL_GROUP_POSITION_MEMBERSHIP } from './mutations'
import {
  AssignNewInternalGroupPositionMembershipReturns,
  AssignNewInternalGroupPositionMembershipVariables,
  InternalGroupPositionType,
  ManageInternalGroupUser,
} from './types'

export interface InternalGroupPositionTypeOption {
  value: InternalGroupPositionType
  label: string
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
`

interface UserManagementTableRowProp {
  userData: ManageInternalGroupUser
}

export const UserManagementTableRow: React.VFC<UserManagementTableRowProp> = ({
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

  const handleAssignNewPosition = () => {
    if (selectedInternalGroupPositionType === null) return

    // We also do not execute the mutation if the type has not changed
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
    }).then(() => toast.success('Bruker oppdatert!'))
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
        <Button
          onClick={() => {
            handleAssignNewPosition()
          }}
          disabled={loading}
        >
          Endre status
        </Button>
        {/* Button should set the date ended for this membership to now */}
        <Button color="red">Ferdig med KSG</Button>
      </td>
    </>
  )
}
