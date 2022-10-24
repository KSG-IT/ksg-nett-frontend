import { Stack } from '@mantine/core'
import { InternalGroupApplicantData } from 'modules/admissions/types.graphql'
import { InternalGroupPreviewCard } from './InternalGroupPreviewCard'

export const InternalGroupPreviewList: React.FC<{
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
