import { useMutation } from '@apollo/client'
import { useState } from 'react'
import Select from 'react-select'
import styled from 'styled-components'
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

  const options: InternalGroupPositionTypeOption[] = [
    {
      value: InternalGroupPositionType['GANG_MEMBER'],
      label: 'Gjengmedlem',
    },
    {
      value: InternalGroupPositionType['HANGAROUND'],
      label: 'Hangaround',
    },
    {
      value: InternalGroupPositionType['TEMPORARY_LEAVE'],
      label: 'Permisjon',
    },
    {
      value: InternalGroupPositionType['FUNCTIONARY'],
      label: 'Funksjonær',
    },
    {
      value: InternalGroupPositionType['ACTIVE_GANG_MEMBER_PANG'],
      label: 'Gjengpang',
    },
    {
      value: InternalGroupPositionType['ACTIVE_FUNCTIONARY_PANG'],
      label: 'Aktiv funkepang',
    },
    {
      value: InternalGroupPositionType['INTEREST_GROUP_MEMBER'],
      label: 'Interessegruppemedlem',
    },
    {
      value: InternalGroupPositionType['OLD_FUNCTIONARY_PANG'],
      label: 'Gammel funkepang',
    },
    {
      value: InternalGroupPositionType['OLD_GANG_MEMBER_PANG'],
      label: 'Gammel gjengpang',
    },
  ]

  const handleAssignNewPosition = () => {
    // Can replace this with a useEffect which renders the button disabled if not
    console.log(selectedInternalGroupPositionType === null)
    if (selectedInternalGroupPositionType === null) return

    console.log(
      selectedInternalGroupPositionType.value ===
        userData.internalGroupPositionType
    )
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
    }).then(res => console.log(res))
  }

  const currentType = options.find(
    option => option.value === userData.internalGroupPositionType
  )
  const defaultChoice = currentType === undefined ? null : currentType

  return (
    <Wrapper>
      <Select
        defaultValue={defaultChoice}
        onChange={setSelectedInternalGroupPositionType}
        options={options}
      />

      <button
        onClick={() => {
          handleAssignNewPosition()
        }}
        disabled={loading}
      >
        Endre status
      </button>
    </Wrapper>
  )
}
