import { useQuery } from '@apollo/client'
import { FullPageError } from 'components/FullPageComponents'
import { FullContentLoader } from 'components/Loading'
import styled from 'styled-components'
import { VALID_APPLICANTS_QUERY } from '../AdmissionDashboard/queries'
import { ApplicantNode } from '../types'
import { ToggleApplicantInline } from './ToggleApplicantInline'
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  overflow-y: scroll;
`

const Table = styled.div`
  display: flex;
  flex-direction: column;
`

const HeaderRow = styled.div`
  display: flex;
  flex-direction: row;
`

const HeaderCell = styled.div`
  font-weight: 500;
  width: 170px;
`

const TableRow = styled.div`
  display: flex;
  flex-direction: row;
`

const TableCell = styled.div`
  width: 170px;
`

export const CloseAdmission: React.VFC = () => {
  const { error, loading, data } = useQuery(VALID_APPLICANTS_QUERY)

  if (error) return <FullPageError />

  if (loading || !data) return <FullContentLoader />

  const { validApplicants } = data

  return (
    <Wrapper>
      {/* Here we can display the priorities and how each of the internal groups prioritizes/evaluates them? */}
      <Table>
        <HeaderRow>
          <HeaderCell>Navn</HeaderCell>
          <HeaderCell>Førstevalg</HeaderCell>
          <HeaderCell>Interngjeng status</HeaderCell>
          <HeaderCell>Andrevalg</HeaderCell>
          <HeaderCell>Interngjeng status</HeaderCell>
          <HeaderCell>Tredjevalg</HeaderCell>
          <HeaderCell>Interngjeng status</HeaderCell>
          <HeaderCell>Ta opp?</HeaderCell>
        </HeaderRow>
        {validApplicants.map((applicant: ApplicantNode) => (
          <TableRow>
            <TableCell>{applicant.fullName}</TableCell>
            <TableCell>
              {applicant.priorities[0]?.internalGroupPosition?.name}
            </TableCell>
            <TableCell>
              {applicant.priorities[0]?.internalGroupPriority}
            </TableCell>
            <TableCell>
              {applicant.priorities[1]?.internalGroupPosition?.name}
            </TableCell>
            <TableCell>
              {applicant.priorities[1]?.internalGroupPriority}
            </TableCell>
            <TableCell>
              {applicant.priorities[2]?.internalGroupPosition?.name}
            </TableCell>
            <TableCell>
              {applicant.priorities[2]?.internalGroupPriority}
            </TableCell>
            <TableCell>
              <ToggleApplicantInline applicant={applicant} />
            </TableCell>
          </TableRow>
        ))}
      </Table>
      <button>Ta opp søkere til KSG</button>
    </Wrapper>
  )
}
