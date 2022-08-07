import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button, Card, Menu, Table } from '@mantine/core'
import { parseApplicantPriorityInternalGroupPosition } from 'modules/admissions/parsing'
import { CoreApplicantNode } from 'modules/admissions/types.graphql'
import { useHistory } from 'react-router-dom'
import { ApplicantStatusBadge } from '../ApplicantStatusBadge'

export const ApplicantsTable: React.FC<{
  applicants: CoreApplicantNode[]
}> = ({ applicants }) => {
  const history = useHistory()

  const handleMoreInfo = (applicantId: string) => {
    history.push(`/admissions/applicants/${applicantId}`)
  }

  const rows = applicants.map(applicant => (
    <tr key={applicant.id}>
      <td>{applicant.fullName}</td>
      <td>{applicant.email}</td>
      <td>
        <ApplicantStatusBadge applicantStatus={applicant.status} />
      </td>
      <td>
        {parseApplicantPriorityInternalGroupPosition(applicant.priorities[0])}
      </td>
      <td>
        {parseApplicantPriorityInternalGroupPosition(applicant.priorities[1])}
      </td>
      <td>
        {parseApplicantPriorityInternalGroupPosition(applicant.priorities[2])}
      </td>

      <td>
        <Menu position="left-start">
          <Menu.Target>
            <Button variant="outline">
              <FontAwesomeIcon icon="ellipsis-h" />
            </Button>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Label>Valg</Menu.Label>
            <Menu.Item
              icon={<FontAwesomeIcon icon="eye" />}
              onClick={() => handleMoreInfo(applicant.id)}
            >
              Mer info
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </td>
    </tr>
  ))

  return (
    <Card>
      <Table>
        <thead>
          <tr>
            <th>Navn</th>
            <th>Epost</th>
            <th>Status</th>
            <th>Prio 1</th>
            <th>Prio 2</th>
            <th>Prio 3</th>
            <th>Handlinger</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>
    </Card>
  )
}
