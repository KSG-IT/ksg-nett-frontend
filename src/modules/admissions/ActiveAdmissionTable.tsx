import styled from 'styled-components'
import { ApplicantStatusBadge } from './ApplicantStatusBadge'
import { AdmissionNode } from './types'
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  background-color: ${props => props.theme.colors.white};
`

const TableHeaderRow = styled.div`
  display: flex;
  flex-direction: row;
  font-size: 14px;
  font-weight: 600;
  gap: 10px;
`

const TableHeaderCell = styled.div``

const TableRow = styled.div`
  display: flex;
  flex-direction: row;
  font-size: 12px;
  font-weight: 400;
  gap: 10px;
`

const TableCell = styled.div``

interface ActiveAdmissionTableProps {
  admission: AdmissionNode
}

export const ActiveAdmissionTable: React.VFC<ActiveAdmissionTableProps> = ({
  admission,
}) => {
  const { applicants } = admission
  return (
    <Wrapper>
      <TableHeaderRow>
        <TableHeaderCell>Navn</TableHeaderCell>
        <TableHeaderCell>epost</TableHeaderCell>
        <TableHeaderCell>status</TableHeaderCell>
        <TableHeaderCell>Prioritet 1</TableHeaderCell>
        <TableHeaderCell>Prioritet 2</TableHeaderCell>
        <TableHeaderCell>Prioritet 3</TableHeaderCell>
      </TableHeaderRow>
      {applicants.map(applicant => (
        <TableRow>
          <TableCell>{applicant.fullName}</TableCell>
          <TableCell>{applicant.email}</TableCell>
          <TableCell>Barservitør</TableCell>
          <TableCell>Økonomiansvarlig</TableCell>
          <TableCell>Bartender</TableCell>
          <TableCell>
            <ApplicantStatusBadge applicantStatus={applicant.status} />
          </TableCell>
        </TableRow>
      ))}
    </Wrapper>
  )
}
