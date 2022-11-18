import { Table } from '@mantine/core'
import { CardTable } from 'components/CardTable'
import { ApplicantNode } from 'modules/admissions/types.graphql'
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
      key={applicant.id}
      applicant={applicant}
      internalGroupId={internalGroup.id}
    />
  ))

  return (
    <CardTable highlightOnHover>
      <thead>
        <tr>
          <th>Navn</th>
          <th>Førstevalg</th>
          <th></th>
          <th>Andrevalg</th>
          <th></th>
          <th>Tredjevalg</th>
          <th></th>
          <th>Handlinger</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </CardTable>
  )
}
