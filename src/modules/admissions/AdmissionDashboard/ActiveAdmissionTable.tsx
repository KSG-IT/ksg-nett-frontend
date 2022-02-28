import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import { ApplicantStatusBadge } from '../ApplicantStatusBadge'
import { AdmissionNode } from '../types'
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

  &:hover {
    cursor: pointer;
    opacity: 0.7;
  }
`

const TableCell = styled.div``

interface ActiveAdmissionTableProps {
  admission: AdmissionNode
}

export const ActiveAdmissionTable: React.VFC<ActiveAdmissionTableProps> = ({
  admission,
}) => {
  const { applicants } = admission
  const history = useHistory()

  const handleRedirect = (applicantId: string) => {
    history.push(`/admissions/applicants/${applicantId}`)
  }
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
        <TableRow
          key={applicant.id}
          onClick={() => handleRedirect(applicant.id)}
        >
          <TableCell key="fullname">{applicant.fullName}</TableCell>
          <TableCell key="email">{applicant.email}</TableCell>
          {applicant.priorities.map((priority, i) => {
            const key = `priority-${i}`
            if (priority === null)
              return <TableCell key={key}>Ingen prio</TableCell>

            return (
              <TableCell key={key}>
                {priority.internalGroupPosition.name}
              </TableCell>
            )
          })}
          <TableCell>
            <ApplicantStatusBadge applicantStatus={applicant.status} />
          </TableCell>
        </TableRow>
      ))}
    </Wrapper>
  )
}
