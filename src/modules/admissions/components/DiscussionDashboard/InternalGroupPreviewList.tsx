import { SimpleGrid, Stack } from '@mantine/core'
import { InternalGroupApplicantData } from 'modules/admissions/types.graphql'
import { InternalGroupPreviewCard } from './InternalGroupPreviewCard'
import { useIsMobile } from 'util/hooks'

export const InternalGroupPreviewList: React.FC<{
  allInternalGroupApplicantData: InternalGroupApplicantData[]
}> = ({ allInternalGroupApplicantData }) => {
  const isMobile = useIsMobile()
  return (
    <SimpleGrid cols={isMobile ? 2 : 4}>
      {allInternalGroupApplicantData.map(internalGroupData => (
        <InternalGroupPreviewCard
          key={internalGroupData.internalGroup.id}
          internalGroupDiscussionData={internalGroupData}
        />
      ))}
    </SimpleGrid>
  )
}
