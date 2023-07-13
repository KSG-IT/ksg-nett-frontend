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
    .map(applicant => <ToggleApplicantTableRow applicant={applicant} />)

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
