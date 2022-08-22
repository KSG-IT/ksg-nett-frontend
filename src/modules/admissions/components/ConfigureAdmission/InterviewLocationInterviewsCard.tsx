import { Group, Stack, Text, Title } from '@mantine/core'
import { format } from 'date-fns'
import { InterviewLocationDateGrouping } from 'modules/admissions/types.graphql'

export interface InterviewLocationInterviewsCardProps {
  interviewlocationGrouping: InterviewLocationDateGrouping
}

export const InterviewLocationInterviewsCard: React.VFC<
  InterviewLocationInterviewsCardProps
> = ({ interviewlocationGrouping }) => {
  const { name, interviews } = interviewlocationGrouping
  return (
    <Stack m={0} p={0}>
      <Title order={3}>{name}</Title>
      {interviews.map((interview, index) => (
        <Group key={index}>
          <Text>
            {format(new Date(interview.interviewStart), 'HH:mm')}-
            {format(new Date(interview.interviewEnd), 'HH:mm')}
          </Text>
        </Group>
      ))}
    </Stack>
  )
}
