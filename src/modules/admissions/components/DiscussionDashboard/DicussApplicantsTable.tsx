import { Table } from '@mantine/core'
import { CardTable } from 'components/CardTable'
import { ApplicantNode } from 'modules/admissions/types.graphql'
import { InternalGroupNode } from 'modules/organization/types'
import { DiscussApplicantTableRows } from './DiscussApplicantTableRows'
interface DiscussApplicantsTableProps {
  internalGroup: InternalGroupNode
  applicants: ApplicantNode[]
}

export const DiscussApplicantsTable: React.FC<DiscussApplicantsTableProps> = ({
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
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Navn</Table.Th>
          <Table.Th>Førstevalg</Table.Th>
          <Table.Th></Table.Th>
          <Table.Th>Andrevalg</Table.Th>
          <Table.Th></Table.Th>
          <Table.Th>Tredjevalg</Table.Th>
          <Table.Th></Table.Th>
          <Table.Th>Handlinger</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>{rows}</Table.Tbody>
    </CardTable>
  )
}
