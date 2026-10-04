import { Table } from '@mantine/core'
import { CardTable } from 'components/CardTable'
import { ApplicantNode } from 'modules/admissions/types.graphql'
import { ToggleApplicantTableRow } from './ToggleApplicantTableRow'

interface CloseAdmissionTableProps {
  applicants: ApplicantNode[]
  nameFilter: string
}

export const CloseAdmissionTable: React.FC<CloseAdmissionTableProps> = ({
  applicants,
  nameFilter,
}) => {
  const applicantRows = applicants
    .filter(applicant =>
      applicant.fullName.toLowerCase().includes(nameFilter.toLowerCase())
    )
    .map(applicant => (
      <ToggleApplicantTableRow key={applicant.id} applicant={applicant} />
    ))

  return (
    <CardTable>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Navn</Table.Th>
          <Table.Th>Førstevalg</Table.Th>
          <Table.Th></Table.Th>
          <Table.Th>Andrevalg</Table.Th>
          <Table.Th></Table.Th>
          <Table.Th>Tredjevalg</Table.Th>
          <Table.Th></Table.Th>
          <Table.Th>Ja?</Table.Th>
          {/* <Table.Th>Får hvilket verv</Table.Th> */}
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>{applicantRows}</Table.Tbody>
    </CardTable>
  )
}
