import { useQuery } from '@apollo/client'
import { Box, createStyles, Select, SelectProps } from '@mantine/core'
import { ALL_INTERNAL_GROUPS_QUERY } from 'modules/organization/queries'
import { AllInternalGroupsReturns } from 'modules/organization/types'
import { internalGroupToSelectOptions } from 'util/organization'

interface InternalGroupSelectProps extends Omit<SelectProps, 'data' | 'value'> {
  internalGroupId?: string
  fullwidth?: boolean
  width?: string
  withOtherOption?: boolean
  setInternalGroupCallback: (slectedId: string) => void
}

export const InternalGroupSelect: React.FC<InternalGroupSelectProps> = ({
  internalGroupId,
  withOtherOption = false,
  setInternalGroupCallback,
  ...rest
}) => {
  const { loading, data } = useQuery<AllInternalGroupsReturns>(
    ALL_INTERNAL_GROUPS_QUERY
  )

  const options = internalGroupToSelectOptions(data?.allInternalGroups)
  if (withOtherOption) {
    options.push({ value: 'other', label: 'Annet' })
  }
  const initialValue = options.find(option => option.value == internalGroupId)

  return (
    <Select
      value={internalGroupId}
      placeholder={'Velg gruppe'}
      defaultValue={initialValue?.value}
      data={options}
      // ToDo: Have groupings for internal and interest group
      onChange={setInternalGroupCallback}
      {...rest}
    />
  )
}
