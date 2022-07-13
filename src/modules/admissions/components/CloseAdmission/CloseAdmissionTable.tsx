import { Table } from '@mantine/core'
import { ApplicantNode } from 'modules/admissions/types.graphql'
import { ToggleApplicantTableRow } from './ToggleApplicantTableRow'

interface CloseAdmissionTableProps {
  applicants: ApplicantNode[]
}

export const CloseAdmissionTable: React.VFC<CloseAdmissionTableProps> = ({
  applicants,
}) => {
  const applicantRows = applicants.map(applicant => (
    <ToggleApplicantTableRow applicant={applicant} />
  ))

  return (
    <Table>
      <thead>
        <tr>
          <th key={1}>Navn</th>
          <th key={2}>Førstevalg</th>
          <th key={3}></th>
          <th key={4}>Andrevalg</th>
          <th key={5}></th>
          <th key={6}>Tredjevalg</th>
          <th key={7}></th>
          <th key={8}>Ja?</th>
          {/* <th>Får hvilket verv</th> */}
        </tr>
      </thead>
      <tbody>{applicantRows}</tbody>
    </Table>
  )
}
