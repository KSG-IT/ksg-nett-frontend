import { Group, Stack, Table, Text, Title } from '@mantine/core'
import { format } from 'util/date-fns'
import { InterviewLocationDateGrouping } from 'modules/admissions/types.graphql'

export interface InterviewLocationInterviewsCardProps {
  interviewlocationGrouping: InterviewLocationDateGrouping
}

export const InterviewLocationInterviewsCard: React.FC<
  InterviewLocationInterviewsCardProps
> = ({ interviewlocationGrouping }) => {
  const { name, interviews } = interviewlocationGrouping
  return (
    <Table style={{ width: 'auto' }}>
      <Table.Thead>
        <Table.Tr>
          <Table.Th colSpan={2}>{name}</Table.Th>
        </Table.Tr>
        <Table.Tr>
          <Table.Th>Fra</Table.Th>
          <Table.Th>Til</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {interviews.map((interview, index) => (
          <Table.Tr key={index}>
            <Table.Td>
              {format(new Date(interview.interviewStart), 'HH:mm')}
            </Table.Td>
            <Table.Td>
              {format(new Date(interview.interviewEnd), 'HH:mm')}
            </Table.Td>
          </Table.Tr>
        ))}
      </Table.Tbody>
    </Table>
  )
}
