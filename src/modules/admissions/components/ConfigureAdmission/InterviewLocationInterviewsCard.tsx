import { format } from 'date-fns'
import {
  InterviewLocationDateGrouping,
  InterviewScheduleTemplateNode,
} from 'modules/admissions/types.graphql'
import styled from 'styled-components'

const Wrapper = styled.div``

export interface InterviewLocationInterviewsCardProps {
  interviewlocationGrouping: InterviewLocationDateGrouping
  interviewScheduleTemplate: InterviewScheduleTemplateNode
}

export const InterviewLocationInterviewsCard: React.VFC<
  InterviewLocationInterviewsCardProps
> = ({ interviewlocationGrouping, interviewScheduleTemplate }) => {
  const { name, interviews } = interviewlocationGrouping
  return (
    <Wrapper>
      <h3>{name}</h3>
      {interviews.map((interview, index) => (
        <div key={index}>
          <span>{format(new Date(interview.interviewStart), 'HH:mm')}</span>
          <span>{format(new Date(interview.interviewEnd), 'HH:mm')}</span>
        </div>
      ))}
    </Wrapper>
  )
}
