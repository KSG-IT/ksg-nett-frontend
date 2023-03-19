import { Select } from '@mantine/core'
import { internalGroupPositionTypeOptions } from 'modules/organization/consts'
import { InternalGroupPositionType } from 'modules/organization/types.graphql'
import React from 'react'

interface InternalGroupPositionTypeSelectProps {
  onChange: (value: InternalGroupPositionType) => void
}

export const InternalGroupPositionTypeSelect = React.forwardRef<
  React.ElementRef<typeof Select> & InternalGroupPositionTypeSelectProps,
  Omit<React.ComponentPropsWithoutRef<typeof Select>, 'data'>
>((props, ref) => {
  const options = internalGroupPositionTypeOptions
  return <Select {...props} ref={ref} data={options} />
})
