import { Badge, Paper, Table } from '@mantine/core'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import { AdmissionNode } from '../types'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  background-color: ${props => props.theme.colors.white};
`
const TableRow = styled.tr`
  &:hover {
    cursor: pointer;
  }
`

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

  const rows = applicants.map(applicant => (
    <TableRow key={applicant.id} onClick={() => handleRedirect(applicant.id)}>
      <td>{applicant.fullName}</td>
      <td>{applicant.email}</td>
      <td>
        <Badge>{applicant.status}</Badge>
      </td>
      {applicant.priorities.map((priority, i) => {
        const key = `priority-${i}`
        if (priority === null) return <td key={key}>Ingen prio</td>

        return <td key={key}>{priority.internalGroupPosition.name}</td>
      })}
    </TableRow>
  ))
  return (
    <Wrapper>
      <Paper p="md" style={{ overflow: 'scroll' }}>
        <Table highlightOnHover>
          <thead>
            <td>Navn</td>
            <td>Epost</td>
            <td>Status</td>
            <td>Prioritet 1</td>
            <td>Prioritet 2</td>
            <td>Prioritet 3</td>
          </thead>
          <tbody>{rows}</tbody>
        </Table>
      </Paper>
    </Wrapper>
  )
}
