import { useMutation } from '@apollo/client'
import { NumberInput, Select, Table, UnstyledButton } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { IconTrash } from '@tabler/icons-react'
import {
  DELETE_ADMISSION_AVAILABLE_INTERNAL_GROUP_POSITION_DATA,
  PATCH_ADMISSION_AVAILABLE_INTERNAL_GROUP_POSITION_DATA,
} from 'modules/admissions/mutations'
import {
  AdmissionAvailableInternalGroupPositionData,
  PatchAdmissionAvailableInternalGroupPositionDataReturns,
} from 'modules/admissions/types.graphql'
import React, { useState } from 'react'
import { DeleteMutationReturns, DeleteMutationVariables } from 'types/graphql'

interface PositionAvailabilityInputProps {
  availablePosition: AdmissionAvailableInternalGroupPositionData
}

export const PositionAvailabilityInput: React.FC<
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

  function handleMembershipTypeChange(val: string | null) {
    patchInternalGroupAvailability({
      variables: {
        id: availablePosition.id,
        input: {
          membershipType: val,
        },
      },
    }).then(() =>
      showNotification({
        title: 'Suksess',
        message: 'Vervtype oppdatert',
        color: 'green',
      })
    )
  }

  function handleAvailableNumberChange(val: string | number) {
    if (typeof val !== 'number') return
    setAvailabilityNumber(val)
    patchInternalGroupAvailability({
      variables: {
        id: availablePosition.id,
        input: {
          availablePositions: val,
        },
      },
    }).then(() =>
      showNotification({
        title: 'Suksess',
        message: 'Antall oppdatert',
        color: 'green',
      })
    )
  }

  const handleRemovePosition = () => {
    removeInternalGroupPosition({ variables: { id: availablePosition.id } })
  }

  return (
    <Table.Tr>
      <Table.Td>{availablePosition.internalGroupPosition.name}</Table.Td>
      <Table.Td>
        <Select
          data={[
            { label: 'Funksjonær', value: 'FUNCTIONARY' },
            { label: 'Gjengmedlem', value: 'GANG_MEMBER' },
          ]}
          onChange={val => handleMembershipTypeChange(val)}
          defaultValue={availablePosition.membershipType}
        />
      </Table.Td>
      <Table.Td>
        <NumberInput
          value={availabilityNumber}
          onChange={val =>
            typeof val === 'number' && handleAvailableNumberChange(val)
          }
        />
      </Table.Td>
      <Table.Td>
        <UnstyledButton onClick={handleRemovePosition}>
          <IconTrash />
        </UnstyledButton>
      </Table.Td>
    </Table.Tr>
  )
}
