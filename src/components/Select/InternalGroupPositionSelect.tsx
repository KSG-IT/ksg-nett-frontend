import { useQuery } from '@apollo/client'
import { Select } from '@mantine/core'
import { ALL_INTERNAL_GROUP_POSITIONS } from 'modules/organization/queries'
import { AllInternalGroupPositionsReturns } from 'modules/organization/types'
import React from 'react'

import { internalGroupPositionToSelectOptions } from 'util/organization'

interface InternalGroupPositionSelectProps {
  setInternalGroupPositionCallback: (slectedId: string) => void
}

export const InternalGroupPositionSelect = React.forwardRef<
  React.ElementRef<typeof Select>,
  Omit<React.ComponentPropsWithoutRef<typeof Select>, 'data'>
>((props, ref) => {
  const { data } = useQuery<AllInternalGroupPositionsReturns>(
    ALL_INTERNAL_GROUP_POSITIONS
  )

  const options = internalGroupPositionToSelectOptions(
    data?.allInternalGroupPositions
  )

  return <Select {...props} ref={ref} data={options} />
})
