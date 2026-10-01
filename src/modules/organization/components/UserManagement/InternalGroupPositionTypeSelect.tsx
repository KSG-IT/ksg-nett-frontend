import { Select, SelectProps } from '@mantine/core'
import { internalGroupPositionTypeOptions } from 'modules/organization/consts'
import { InternalGroupPositionType } from 'modules/organization/types.graphql'
import React from 'react'

interface InternalGroupPositionTypeSelectProps
  extends Omit<SelectProps, 'data' | 'onChange'> {
  onChange?: (value: InternalGroupPositionType) => void
  ref?: React.Ref<HTMLInputElement>
}

export const InternalGroupPositionTypeSelect: React.FC<
  InternalGroupPositionTypeSelectProps
> = ({ onChange, ref, ...props }) => {
  const options = internalGroupPositionTypeOptions
  return (
    <Select
      {...props}
      ref={ref}
      data={options}
      onChange={val => onChange?.(val as InternalGroupPositionType)}
    />
  )
}
