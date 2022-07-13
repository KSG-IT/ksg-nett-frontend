import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Badge, Table } from '@mantine/core'
import { InfoPopover } from 'components/InfoPopover'
import { format } from 'date-fns'
import { CoreApplicantNode } from 'modules/admissions/types.graphql'
import { ApplicantStatusBadge } from '../ApplicantStatusBadge'
import { ApplicantTableRowMenu } from './ApplicantTableRowMenu'

const parseApplicantName = (applicant: CoreApplicantNode) => {
  if (applicant.fullName === ' ') return 'Mangler data'

  return applicant.fullName
}

const getInterviewTime = (applicant: CoreApplicantNode) => {
  if (applicant.interview === null) return 'N/A'

  const { interview } = applicant
  return format(new Date(interview.interviewStart), 'iii d MMM HH:mm')
}

const InterviewCoveredBadge: React.VFC<{ covered: boolean }> = ({
  covered,
}) => {
  const color = covered ? 'green' : 'red'
  const icon = covered ? 'check' : 'times'

  return (
    <Badge color={color}>
      <FontAwesomeIcon icon={icon} />
    </Badge>
  )
}

export const ApplicantsTable: React.VFC<{
  applicants: CoreApplicantNode[]
}> = ({ applicants }) => {
  const rows = applicants.map(applicant => (
    <tr key={applicant.id}>
      <td>{parseApplicantName(applicant)}</td>
      <td>
        <ApplicantStatusBadge applicantStatus={applicant.status} />
      </td>
      <td>{applicant.phone}</td>
      <td>{getInterviewTime(applicant)}</td>
      <td></td>
      <td>
        <InterviewCoveredBadge covered={applicant.interviewIsCovered} />
      </td>
      <td>
        <ApplicantTableRowMenu applicant={applicant} />
      </td>
    </tr>
  ))

  return (
    <Table highlightOnHover>
      <thead>
        <tr>
          <td>Navn</td>
          <td>Status</td>
          <td>Telefon</td>
          <td>Intervjutid</td>
          <td>Intevjuere</td>
          <td>
            Ayokay?{' '}
            <InfoPopover
              content={
                'Grønn status betyr at minst én person fra denne interngjengen representeres på intervjuet'
              }
            />
          </td>
          <td></td>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </Table>
  )
}
