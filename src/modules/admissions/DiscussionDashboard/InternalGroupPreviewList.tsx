import { Stack } from '@mantine/core'
import { InternalGroupApplicantData } from '../types'
import { InternalGroupPreviewCard } from './InternalGroupPreviewCard'

export const InternalGroupPreviewList: React.VFC<{
  allInternalGroupApplicantData: InternalGroupApplicantData[]
}> = ({ allInternalGroupApplicantData }) => {
  return (
    <Stack>
      {allInternalGroupApplicantData.map(internalGroupData => (
        <InternalGroupPreviewCard
          key={internalGroupData.internalGroup.id}
          internalGroupDiscussionData={internalGroupData}
        />
      ))}
    </Stack>
  )
}
