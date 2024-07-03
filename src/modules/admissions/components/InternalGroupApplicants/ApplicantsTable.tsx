import { Avatar, Badge } from '@mantine/core'
import { createStyles } from '@mantine/emotion'
import { IconCheck, IconX } from '@tabler/icons-react'
import { CardTable } from 'components/CardTable'
import { CoreApplicantNode } from 'modules/admissions/types.graphql'
import { UserThumbnail } from 'modules/users/components'
import { useNavigate } from 'react-router-dom'
import { format } from 'util/date-fns'
import { ApplicantStatusBadge } from '../ApplicantStatusBadge'
import { ApplicantTableRowMenu } from './ApplicantTableRowMenu'

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
  const { classes } = useStyles()
  const navigate = useNavigate()

  function handleApplicantRedirect(applicantId: string) {
    navigate(`/admissions/applicants/${applicantId}`)
  }

  const rows = applicants.map(applicant => (
    <tr key={applicant.id}>
      <td
        className={classes.interactiveTd}
        placeholder=""
        onClick={() => handleApplicantRedirect(applicant.id)}
      >
        {safeParseApplicantName(applicant)}
      </td>
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

const useStyles = createStyles(theme => ({
  interactiveTd: {
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: theme.colors.gray[0],
      textDecoration: 'underline',
    },
  },
}))
