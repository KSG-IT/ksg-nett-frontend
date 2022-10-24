import { Table } from '@mantine/core'
import { CardTable } from 'components/CardTable'
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
    <CardTable>
      <thead>
        <tr>
          <th>Navn</th>
          <th>Førstevalg</th>
          <th></th>
          <th>Andrevalg</th>
          <th></th>
          <th>Tredjevalg</th>
          <th></th>
          <th>Ja?</th>
          {/* <th>Får hvilket verv</th> */}
        </tr>
      </thead>
      <tbody>{applicantRows}</tbody>
    </CardTable>
  )
}
