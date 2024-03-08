import { useQuery } from '@apollo/client'
import { Select, SelectProps } from '@mantine/core'
import { ALL_INTERNAL_GROUP_POSITIONS } from 'modules/organization/queries'
import { AllInternalGroupPositionsReturns } from 'modules/organization/types'
import React from 'react'

import { internalGroupPositionToSelectOptions } from 'util/organization'

interface InternalGroupPositionSelectProps
  extends Omit<SelectProps, 'data' | 'value'> {
  internalGroupPositionId?: string
  onChange?: (internalGroupPositionId: string) => void
}

export const InternalGroupPositionSelect: React.FC<
  InternalGroupPositionSelectProps
> = ({ internalGroupPositionId, onChange, ...props }, ref) => {
  const { data, loading } = useQuery<AllInternalGroupPositionsReturns>(
    ALL_INTERNAL_GROUP_POSITIONS
  )

  const options = loading
    ? []
    : internalGroupPositionToSelectOptions(data?.allInternalGroupPositions)

  return (
    <Select
      defaultValue={internalGroupPositionId}
      {...props}
      ref={ref}
      onChange={onChange}
      data={options}
    />
  )
}
