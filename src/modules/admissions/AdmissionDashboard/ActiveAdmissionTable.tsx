import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Divider, Menu, Paper, Table } from '@mantine/core'
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
    <TableRow key={applicant.id}>
      <td>{applicant.fullName}</td>
      <td>{applicant.email}</td>
      <td>
        <ApplicantStatusBadge applicantStatus={applicant.status} />
      </td>
      {applicant.priorities.map((priority, i) => {
        const content =
          priority === null ? 'Ingen prio' : priority.internalGroupPosition.name
        return <td key={i}>{content}</td>
      })}
      <td>
        <Menu>
          <Menu.Label>Valg</Menu.Label>
          <Menu.Item
            icon={<FontAwesomeIcon icon="eye" />}
            onClick={() => handleRedirect(applicant.id)}
          >
            Mer info
          </Menu.Item>

          <Divider />
          <Menu.Label>Admin</Menu.Label>
          <Menu.Item color={'red'} icon={<FontAwesomeIcon icon="times" />}>
            Slett
          </Menu.Item>
        </Menu>
      </td>
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
            <td>Handlinger</td>
          </thead>
          <tbody>{rows}</tbody>
        </Table>
      </Paper>
    </Wrapper>
  )
}
