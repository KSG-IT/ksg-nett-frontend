import { Avatar, Table } from '@mantine/core'
import { Badge } from 'components/Badge'
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
    <Table.Tr key={applicant.id}>
      <Table.Td
        className={classes.interactiveTd}
        onClick={() => handleApplicantRedirect(applicant.id)}
      >
        {safeParseApplicantName(applicant)}
      </Table.Td>
      <Table.Td>
        <ApplicantStatusBadge applicantStatus={applicant.status} />
      </Table.Td>
      <Table.Td>
        {applicant.wantsDigitalInterview ? (
          <Badge color="orange">Digitalt</Badge>
        ) : (
          <Badge color="grape">Fysisk</Badge>
        )}
      </Table.Td>
      <Table.Td>{applicant.phone}</Table.Td>
      <Table.Td>{getInterviewTime(applicant)}</Table.Td>
      <Table.Td>
        <Avatar.Group>
          {applicant.interview?.interviewers.map(interviewer => (
            <UserThumbnail key={interviewer.id} user={interviewer} />
          ))}
        </Avatar.Group>
      </Table.Td>
      <Table.Td>
        <InterviewCoveredBadge covered={applicant.interviewIsCovered} />
      </Table.Td>
      <Table.Td>
        <ApplicantTableRowMenu applicant={applicant} />
      </Table.Td>
    </Table.Tr>
  ))

  return (
    <CardTable highlightOnHover compact>
      <Table.Thead>
        <Table.Tr>
          <Table.Td>Navn</Table.Td>
          <Table.Td>Status</Table.Td>
          <Table.Td>Intervjutype</Table.Td>
          <Table.Td>Telefon</Table.Td>
          <Table.Td>Intervjutid</Table.Td>
          <Table.Td>Intevjuere</Table.Td>
          <Table.Td>Dekket?</Table.Td>
          <Table.Td></Table.Td>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>{rows}</Table.Tbody>
    </CardTable>
  )
}

const useStyles = createStyles({
  interactiveTd: {
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: 'var(--mantine-color-gray-0)',
      textDecoration: 'underline',
    },
  },
})
