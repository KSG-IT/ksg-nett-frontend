import { Group, Stack, Table, Text, Title } from '@mantine/core'
import { format } from 'util/date-fns'
import { InterviewLocationDateGrouping } from 'modules/admissions/types.graphql'

export interface InterviewLocationInterviewsCardProps {
  interviewlocationGrouping: InterviewLocationDateGrouping
}

export const InterviewLocationInterviewsCard: React.VFC<
  InterviewLocationInterviewsCardProps
> = ({ interviewlocationGrouping }) => {
  const { name, interviews } = interviewlocationGrouping
  return (
    <Table style={{ width: 'auto' }}>
      <thead>
        <tr>
          <th colSpan={2}>{name}</th>
        </tr>
        <tr>
          <th>Fra</th>
          <th>Til</th>
        </tr>
      </thead>
      <tbody>
        {interviews.map((interview, index) => (
          <tr key={index}>
            <td>{format(new Date(interview.interviewStart), 'HH:mm')}</td>
            <td>{format(new Date(interview.interviewEnd), 'HH:mm')}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  )
}
