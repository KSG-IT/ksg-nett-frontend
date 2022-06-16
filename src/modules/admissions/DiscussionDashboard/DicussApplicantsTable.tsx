import { Table } from '@mantine/core'
import { ApplicantNode } from 'modules/admissions/types'
import { InternalGroupNode } from 'modules/organization/types'
import { DiscussApplicantTableRows } from './DiscussApplicantTableRows'
interface DiscussApplicantsTableProps {
  internalGroup: InternalGroupNode
  applicants: ApplicantNode[]
}

export const DiscussApplicantsTable: React.VFC<DiscussApplicantsTableProps> = ({
  internalGroup,
  applicants,
}) => {
  const rows = applicants.map(applicant => (
    <DiscussApplicantTableRows
      applicant={applicant}
      internalGroupId={internalGroup.id}
    />
  ))

  return (
    <Table highlightOnHover>
      <thead>
        <td>Navn</td>
        <td>Førstevalg</td>
        <td></td>
        <td>Andrevalg</td>
        <td></td>
        <td>Tredjevalg</td>
        <td></td>
        <td>Handlinger</td>
      </thead>
      <tbody>{rows}</tbody>
    </Table>
  )
}
