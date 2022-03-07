import { useMutation, useQuery } from '@apollo/client'
import { FullPageError } from 'components/FullPageComponents'
import { FullContentLoader } from 'components/Loading'
import { useState } from 'react'
import { toast } from 'react-hot-toast'
import styled from 'styled-components'
import { ApplicantNode } from '../types'
import { TOGGLE_APPLICANT_WILL_BE_ADMITTED_MUTATION } from './mutations'
import { VALID_APPLICANTS_QUERY } from './queries'
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

interface ToggleApplicantWillBeAdmittedReturns {
  toggleApplicantWillBeAdmitted: {
    success: boolean
  }
}

interface CloseAdmissionApplicantInlineProps {
  applicant: ApplicantNode
}

const CloseAdmissionApplicantInline: React.VFC<
  CloseAdmissionApplicantInlineProps
> = ({ applicant }) => {
  const [willBeAdmitted, setWillBeAdmitted] = useState(applicant.willBeAdmitted)

  const [toggleApplicant] = useMutation<ToggleApplicantWillBeAdmittedReturns>(
    TOGGLE_APPLICANT_WILL_BE_ADMITTED_MUTATION,
    {
      variables: { id: applicant.id },
      onCompleted({ toggleApplicantWillBeAdmitted }) {
        const { success } = toggleApplicantWillBeAdmitted

        if (success) {
          setWillBeAdmitted(!willBeAdmitted)
          return
        }
        toast.error('No gikk galt')
      },
    }
  )

  const handleToggleApplicant = () => {
    const toggleFallback = willBeAdmitted
    setWillBeAdmitted(!toggleApplicant)
    toggleApplicant().then(({ data }) => {
      if (data === null || data === undefined) {
        setWillBeAdmitted(toggleFallback)
        return
      }
      const {
        toggleApplicantWillBeAdmitted: { success },
      } = data

      if (!success) {
        setWillBeAdmitted(toggleFallback)
        return
      }
    })
  }

  return (
    <div key={applicant.id}>
      <span>{applicant.fullName} </span>
      <input
        type="checkbox"
        checked={willBeAdmitted}
        onChange={handleToggleApplicant}
      />
    </div>
  )
}

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
              <input type="checkbox"></input>
            </TableCell>
            {/* <CloseAdmissionApplicantInline applicant={applicant} /> */}
          </TableRow>
        ))}
      </Table>
      <button>Ta opp søkere til KSG</button>
    </Wrapper>
  )
}
