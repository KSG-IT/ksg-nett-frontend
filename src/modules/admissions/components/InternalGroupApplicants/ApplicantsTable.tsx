import { Avatar, Badge, Table } from '@mantine/core'
import { IconCheck, IconX } from '@tabler/icons'
import { format } from 'util/date-fns'
import { CoreApplicantNode } from 'modules/admissions/types.graphql'
import { UserThumbnail } from 'modules/users/components'
import { ApplicantStatusBadge } from '../ApplicantStatusBadge'
import { ApplicantTableRowMenu } from './ApplicantTableRowMenu'
import { CardTable } from 'components/CardTable'

function safeParseApplicantName(applicant: CoreApplicantNode) {
  if (applicant.fullName === ' ') return ''

  return applicant.fullName
}

const getInterviewTime = (applicant: CoreApplicantNode) => {
  if (applicant.interview === null) return 'N/A'

  const { interview } = applicant
  return format(new Date(interview.interviewStart), 'iii d MMM HH:mm')
}

const InterviewCoveredBadge: React.FC<{ covered: boolean }> = ({ covered }) => {
  const color = covered ? 'green' : 'red'
  const icon = covered ? <IconCheck /> : <IconX />

  return <Badge color={color}>{icon}</Badge>
}

export const ApplicantsTable: React.FC<{
  applicants: CoreApplicantNode[]
}> = ({ applicants }) => {
  const rows = applicants.map(applicant => (
    <tr key={applicant.id}>
      <td>{safeParseApplicantName(applicant)}</td>
      <td>
        <ApplicantStatusBadge applicantStatus={applicant.status} />
      </td>
      <td>
        {applicant.wantsDigitalInterview ? (
          <Badge color="orange">Digitalt</Badge>
        ) : (
          <Badge color="grape">Fysisk</Badge>
        )}
      </td>
      <td>{applicant.phone}</td>
      <td>{getInterviewTime(applicant)}</td>
      <td>
        <Avatar.Group>
          {applicant.interview?.interviewers.map(interviewer => (
            <UserThumbnail key={interviewer.id} user={interviewer} />
          ))}
        </Avatar.Group>
      </td>
      <td>
        <InterviewCoveredBadge covered={applicant.interviewIsCovered} />
      </td>
      <td>
        <ApplicantTableRowMenu applicant={applicant} />
      </td>
    </tr>
  ))

  return (
    <CardTable highlightOnHover compact>
      <thead>
        <tr>
          <td>Navn</td>
          <td>Status</td>
          <td>Intervjutype</td>
          <td>Telefon</td>
          <td>Intervjutid</td>
          <td>Intevjuere</td>
          <td>Dekket?</td>
          <td></td>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </CardTable>
  )
}
