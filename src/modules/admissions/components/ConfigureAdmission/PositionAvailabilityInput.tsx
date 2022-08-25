import { useMutation } from '@apollo/client'
import { Button, Group, NumberInput, Select, Text } from '@mantine/core'
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
import styled from 'styled-components'
import { DeleteMutationReturns, DeleteMutationVariables } from 'types/graphql'

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  gap: 15px;
`

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
    <Group>
      <Text>{availablePosition.internalGroupPosition.name}</Text>
      <Select
        data={[
          { label: 'Funksjonær', value: 'FUNCTIONARY' },
          { label: 'Gjengmedlem', value: 'GANG_MEMBER' },
        ]}
        onChange={handleMembershipTypeChange}
        defaultValue={availablePosition.membershipType}
      />
      <NumberInput
        value={availabilityNumber}
        onChange={handleAvailableNumberChange}
      />

      <Button onClick={handleRemovePosition}>Fjern verv</Button>
    </Group>
  )
}
