import { useQuery } from '@apollo/client'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Alert, Title } from '@mantine/core'
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
      <Title>Søkeroversikt {name}</Title>
      <Alert
        style={{ overflow: 'visible' }}
        icon={<FontAwesomeIcon icon="info" />}
        title="Obs!"
      >
        Rød farge betyr at ingen fra gjengen representeres på intervjuet eller
        at søkeren ikke har booket et intervju. Det er opp til deres gjeng å
        ringe de søkerne som har dere på førstevalg
      </Alert>
      <Title order={2}>Førstevalg</Title>
      {firstPriorities.map(applicant => (
        <InterviewerActions applicant={applicant} />
      ))}
      <Title order={2}>Andrevalg</Title>
      {secondPriorities.map(applicant => (
        <InterviewerActions applicant={applicant} />
      ))}

      <Title order={2}>Tredjevalg</Title>
      {thirdPriorities.map(applicant => (
        <InterviewerActions applicant={applicant} />
      ))}
    </Wrapper>
  )
}
