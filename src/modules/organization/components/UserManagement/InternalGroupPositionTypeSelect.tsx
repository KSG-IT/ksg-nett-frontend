import { Select, SelectProps } from '@mantine/core'
import { internalGroupPositionTypeOptions } from 'modules/organization/consts'
import { InternalGroupPositionType } from 'modules/organization/types.graphql'
import React from 'react'

interface InternalGroupPositionTypeSelectProps
  extends Omit<SelectProps, 'data' | 'onChange'> {
  onChange?: (value: InternalGroupPositionType) => void
}

export const InternalGroupPositionTypeSelect: React.FC<
  InternalGroupPositionTypeSelectProps
> = ({ onChange, ...props }, ref) => {
  const options = internalGroupPositionTypeOptions
  return (
    <Select
      {...props}
      ref={ref}
      data={options}
      onChange={val => val && onChange?.(val as InternalGroupPositionType)}
    />
  )
}
