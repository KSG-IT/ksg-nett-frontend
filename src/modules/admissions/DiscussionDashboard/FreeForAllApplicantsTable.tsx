import { Button, Paper } from '@mantine/core'
import { useHistory } from 'react-router-dom'
import { ApplicantNode, InternalGroupPositionPriority } from '../types'
import { InternalGroupPositionPriorityBadge } from './InternalGroupPositionPriorityBadge'

const renderPrioritycell = (priority: InternalGroupPositionPriority) => {
  // We need table cell content regardless of the priority being null or not
  if (priority === null)
    return (
      <>
        <td></td>
        <td></td>
      </>
    )

  return (
    <>
      <td>{priority.internalGroupPosition.internalGroup.name}</td>
      <td>
        <InternalGroupPositionPriorityBadge priority={priority} />
      </td>
    </>
  )
}

interface FreeForAllApplicantsTableProps {
  applicants: ApplicantNode[]
  internalGroupId: string
}

export const FreeForAllApplicantsTable: React.VFC<
  FreeForAllApplicantsTableProps
> = ({ applicants, internalGroupId }) => {
  const history = useHistory()

  // Handlers
  const handleMoreInfo = (applicant: ApplicantNode) => {
    history.push(`/admissions/applicants/${applicant.id}`)
  }
  const handleReportInterest = (applicantId: string) => {
    console.log(`Reporting interest in ${applicantId}`)
  }

  // Render rows
  const rows = applicants.map(applicant => (
    <tr key={applicant.id}>
      <td>{applicant.fullName}</td>
      {applicant.priorities.map(priority => renderPrioritycell(priority))}
      <td>
        <Button onClick={() => handleMoreInfo(applicant)} variant="outline">
          Kandidatdetaljer
        </Button>
      </td>
      <td>
        <Button
          onClick={() => handleReportInterest(applicant.id)}
          color="green"
        >
          Vi vil ha!
        </Button>
      </td>
    </tr>
  ))

  return (
    <Paper p="md">
      <table>
        <thead>
          <td>Navn</td>
          <td>Førstevalg</td>
          <td></td>
          <td>Andrevalg</td>
          <td></td>
          <td>Tredjevalg</td>
          <td></td>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    </Paper>
  )
}
