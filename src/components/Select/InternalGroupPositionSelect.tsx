import { useQuery } from '@apollo/client'
import { Select } from '@mantine/core'
import { ALL_INTERNAL_GROUP_POSITIONS } from 'modules/organization/queries'
import { AllInternalGroupPositionsReturns } from 'modules/organization/types'

import { internalGroupPositionToSelectOptions } from 'util/organization'

interface InternalGroupPositionSelectProps {
  setInternalGroupPositionCallback: (slectedId: string) => void
}

export const InternalGroupPositionSelect: React.VFC<
  InternalGroupPositionSelectProps
> = ({ setInternalGroupPositionCallback }) => {
  const { data } = useQuery<AllInternalGroupPositionsReturns>(
    ALL_INTERNAL_GROUP_POSITIONS
  )

  const options = internalGroupPositionToSelectOptions(
    data?.allInternalGroupPositions
  )

  return (
    <Select
      label="Verv"
      placeholder="Velg et verv"
      data={options}
      onChange={setInternalGroupPositionCallback}
    />
  )
}
