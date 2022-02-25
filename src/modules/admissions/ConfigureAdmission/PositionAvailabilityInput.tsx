import { useMutation } from '@apollo/client'
import { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import styled from 'styled-components'
import { DeleteMutationReturns, DeleteMutationVariables } from 'types/graphql'
import { useDebounce } from 'util/hooks'
import { AdmissionAvailableInternalGroupPositionData } from '../types'
import {
  DELETE_ADMISSION_AVAILABLE_INTERNAL_GROUP_POSITION_DATA,
  PATCH_ADMISSION_AVAILABLE_INTERNAL_GROUP_POSITION_DATA,
} from './mutations'
import { PatchAdmissionAvailableInternalGroupPositionDataReturns } from './types'

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
  const firstRender = useRef(true)
  const [availabilityNumber, setAvailabilityNumber] = useState(
    `${availablePosition.availablePositions}`
  )
  const debouncedAvailability = useDebounce(availabilityNumber)

  const [patchInternalGroupAvailability] =
    useMutation<PatchAdmissionAvailableInternalGroupPositionDataReturns>(
      PATCH_ADMISSION_AVAILABLE_INTERNAL_GROUP_POSITION_DATA,
      {
        variables: {
          id: availablePosition.id,
          input: { availablePositions: parseInt(debouncedAvailability) },
        },
      }
    )

  const [removeInternalGroupPosition] = useMutation<
    DeleteMutationReturns,
    DeleteMutationVariables
  >(DELETE_ADMISSION_AVAILABLE_INTERNAL_GROUP_POSITION_DATA, {
    refetchQueries: ['ExternallyAvailableInternalGroupPositionsQuery'],
  })

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      return
    }
    if (debouncedAvailability === '') return

    patchInternalGroupAvailability().then(({ data }) => {
      if (data === null || data === undefined) return
      toast.success(`Oppdatert ${availablePosition.internalGroupPosition.name}`)
      const { patchAdmissionAvailableInternalGroupPositionData } = data
      const { admissionAvailableInternalGroupPositionData } =
        patchAdmissionAvailableInternalGroupPositionData
      setAvailabilityNumber(
        `${admissionAvailableInternalGroupPositionData.availablePositions}`
      )
    })
  }, [
    debouncedAvailability,
    availablePosition.internalGroupPosition.name,
    patchInternalGroupAvailability,
  ])

  const handleRemovePosition = () => {
    removeInternalGroupPosition({ variables: { id: availablePosition.id } })
  }

  return (
    <Wrapper>
      <span>{availablePosition.internalGroupPosition.name}</span>
      <input
        value={availabilityNumber}
        onChange={evt => {
          setAvailabilityNumber(`${evt.target.value}`)
        }}
        type="number"
      />

      <button onClick={handleRemovePosition}>Fjern verv</button>
    </Wrapper>
  )
}
