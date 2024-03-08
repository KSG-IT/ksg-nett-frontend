import { useQuery } from '@apollo/client'
import { Loader, Select, SelectProps } from '@mantine/core'
import { INTERNAL_GROUP_POSITIONS_BY_INTERNAL_GROUP } from 'modules/organization/queries'
import {
  InternalGroupPositionType,
  InternalGroupPositionsByInternalGroupReturns,
  InternalGroupPositionsByInternalGroupVariables,
} from 'modules/organization/types.graphql'
import { internalGroupPositionsByInternalGroupToSelectOption } from 'modules/organization/utils'
import React from 'react'

interface InternalGroupPositionByInternalGroupSelectProps
  extends Omit<SelectProps, 'data'> {
  onChange?: (value: InternalGroupPositionType) => void
  internalGroupId: string
}

export const InternalGroupPositionByInternalGroupSelect: React.FC<
  InternalGroupPositionByInternalGroupSelectProps
> = (props, ref) => {
  const { internalGroupId } = props
  const { loading, data } = useQuery<
    InternalGroupPositionsByInternalGroupReturns,
    InternalGroupPositionsByInternalGroupVariables
  >(INTERNAL_GROUP_POSITIONS_BY_INTERNAL_GROUP, {
    variables: { id: internalGroupId },
    skip: !internalGroupId, // this because the internalGroup has to be fetched from parent component
  })
  if (loading) {
    return <Loader />
  }

  const options = internalGroupPositionsByInternalGroupToSelectOption(
    data?.internalGroupPositionsByInternalGroup
  )
  return <Select {...props} ref={ref} data={options} />
}
