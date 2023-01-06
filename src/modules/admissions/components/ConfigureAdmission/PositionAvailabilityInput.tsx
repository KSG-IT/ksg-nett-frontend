import { useMutation } from '@apollo/client'
import { NumberInput, Select, UnstyledButton } from '@mantine/core'
import { IconTrash } from '@tabler/icons'
import {
  DELETE_ADMISSION_AVAILABLE_INTERNAL_GROUP_POSITION_DATA,
  PATCH_ADMISSION_AVAILABLE_INTERNAL_GROUP_POSITION_DATA,
} from 'modules/admissions/mutations'
import {
  AdmissionAvailableInternalGroupPositionData,
  PatchAdmissionAvailableInternalGroupPositionDataReturns,
} from 'modules/admissions/types.graphql'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { DeleteMutationReturns, DeleteMutationVariables } from 'types/graphql'

interface PositionAvailabilityInputProps {
  availablePosition: AdmissionAvailableInternalGroupPositionData
}

export const PositionAvailabilityInput: React.VFC<
  PositionAvailabilityInputProps
> = ({ availablePosition }) => {
  const [availabilityNumber, setAvailabilityNumber] = useState(
    availablePosition.availablePositions
  )
  const [patchInternalGroupAvailability] =
    useMutation<PatchAdmissionAvailableInternalGroupPositionDataReturns>(
      PATCH_ADMISSION_AVAILABLE_INTERNAL_GROUP_POSITION_DATA
    )

  const [removeInternalGroupPosition] = useMutation<
    DeleteMutationReturns,
    DeleteMutationVariables
  >(DELETE_ADMISSION_AVAILABLE_INTERNAL_GROUP_POSITION_DATA, {
    refetchQueries: ['ExternallyAvailableInternalGroupPositionsQuery'],
  })

  function handleMembershipTypeChange(
    val: 'GANG_MEMBER' | 'FUNCTIONARY' | null
  ) {
    patchInternalGroupAvailability({
      variables: {
        id: availablePosition.id,
        input: {
          membershipType: val,
        },
      },
    }).then(() => toast.success('Oppdatert vervtype'))
  }

  function handleAvailableNumberChange(val: number) {
    setAvailabilityNumber(val)
    patchInternalGroupAvailability({
      variables: {
        id: availablePosition.id,
        input: {
          availablePositions: val,
        },
      },
    }).then(() => toast.success('Oppdatert antall verv'))
  }

  const handleRemovePosition = () => {
    removeInternalGroupPosition({ variables: { id: availablePosition.id } })
  }

  return (
    <tr>
      <td>{availablePosition.internalGroupPosition.name}</td>
      <td>
        <Select
          data={[
            { label: 'Funksjonær', value: 'FUNCTIONARY' },
            { label: 'Gjengmedlem', value: 'GANG_MEMBER' },
          ]}
          onChange={handleMembershipTypeChange}
          defaultValue={availablePosition.membershipType}
        />
      </td>
      <td>
        <NumberInput
          value={availabilityNumber}
          onChange={handleAvailableNumberChange}
        />
      </td>
      <td>
        <UnstyledButton onClick={handleRemovePosition}>
          <IconTrash />
        </UnstyledButton>
      </td>
    </tr>
  )
}
