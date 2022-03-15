import { useQuery } from '@apollo/client'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { FullPageError } from 'components/FullPageComponents'
import { FullContentLoader } from 'components/Loading'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'
import { InterviewerActions } from './InterviewerActions'
import { INTERNAL_GROUP_APPLICANTS_DATA } from './queries'
import {
  InternalGroupApplicantsDataReturns,
  InternalGroupApplicantsDataVariables,
} from './types'

const Wrapper = styled.div`
  ${props => props.theme.layout.default};
  display: flex;
  flex-direction: column;
  overflow-y: scroll;
`

const InfoBoxContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  background-color: ${props => props.theme.colors.blue};
  color: white;
  border-radius: 10px;
  padding: 10px;
  gap: 10px;
`

interface InternalGroupApplicantsParams {
  internalGroupId: string
}

export const InternalGroupApplicants: React.VFC = ({}) => {
  const { internalGroupId } = useParams<InternalGroupApplicantsParams>()
  const { data, loading, error } = useQuery<
    InternalGroupApplicantsDataReturns,
    InternalGroupApplicantsDataVariables
  >(INTERNAL_GROUP_APPLICANTS_DATA, {
    variables: { internalGroup: internalGroupId },
  })

  /**Functionality
   * Should list all applicants, grouped in the following manner
   *  > First priority
   *  > Second prierity
   *  > THird priority
   *  > Should be ordered by interview time and not render those whose interview time is more than an hour ago
   *  > Should distinguish between who is missing an interviewer from the group and who is not
   *  > Should also display some compiled list of all applicants?
   *  > Can also show interview statistics for the group
   *  > The main dashboard can probably show highscore list
   */

  if (error) return <FullPageError />

  if (loading || !data) return <FullContentLoader />

  const { internalGroupApplicantsData } = data

  const {
    firstPriorities,
    secondPriorities,
    thirdPriorities,
    internalGroup: { name },
  } = internalGroupApplicantsData

  return (
    <Wrapper>
      <h1>{name} søkere</h1>
      <InfoBoxContainer>
        <FontAwesomeIcon icon="info" />
        <span>
          Rød farge betyr at ingen fra gjengen representeres på intervjuet eller
          at søkeren ikke har booket et intervju
        </span>
      </InfoBoxContainer>
      <h2>Førstevalg</h2>
      {firstPriorities.map(applicant => (
        <InterviewerActions applicant={applicant} />
      ))}
      <h2>Andrevalg</h2>
      {secondPriorities.map(applicant => (
        <InterviewerActions applicant={applicant} />
      ))}

      <h2>Tredjevalg</h2>
      {thirdPriorities.map(applicant => (
        <InterviewerActions applicant={applicant} />
      ))}
    </Wrapper>
  )
}
