import { useQuery } from '@apollo/client'
import { Select } from '@mantine/core'
import { ALL_INTERNAL_GROUP_POSITIONS } from 'modules/organization/queries'
import { AllInternalGroupPositionsReturns } from 'modules/organization/types'
import { internalGroupPositionToSelectOptions } from 'util/organization'

interface InternalGroupPositionSelectProps {
  internalGroupPositionId?: string
  fullwidth?: boolean
  width?: string
  setInternalGroupPositionCallback: (slectedId: string) => void
}

export const InternalGroupPositionSelect: React.FC<
  InternalGroupPositionSelectProps
> = ({ internalGroupPositionId, setInternalGroupPositionCallback }) => {
  const { data } = useQuery<AllInternalGroupPositionsReturns>(
    ALL_INTERNAL_GROUP_POSITIONS
  )

  const options = internalGroupPositionToSelectOptions(
    data?.allInternalGroupPositions
  )
  const initialValue = options.find(
    option => option.value == internalGroupPositionId
  )

  return (
    <Select
      searchable
      defaultValue={initialValue?.value}
      placeholder="Velg verv"
      data={options}
      // ToDo: Have groupings for internal and interest group
      onChange={setInternalGroupPositionCallback}
    />
  )
}
