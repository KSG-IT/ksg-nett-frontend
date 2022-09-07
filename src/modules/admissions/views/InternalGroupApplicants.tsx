import { useQuery } from '@apollo/client'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Paper, Title } from '@mantine/core'
import { FullPageError } from 'components/FullPageComponents'
import { FullContentLoader } from 'components/Loading'
import { MessageBox } from 'components/MessageBox'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'
import { ApplicantsTable } from '../components/InternalGroupApplicants/ApplicantsTable'
import { INTERNAL_GROUP_APPLICANTS_DATA } from '../queries'
import {
  InternalGroupApplicantsDataReturns,
  InternalGroupApplicantsDataVariables,
} from '../types.graphql'

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
    internalGroup: { name: internalGroupName },
  } = internalGroupApplicantsData

  return (
    <Wrapper>
      <Title>Søkeroversikt {internalGroupName}</Title>
      <MessageBox type="info">
        <FontAwesomeIcon icon="times-circle" color="red" /> indikerer ingen fra{' '}
        {internalGroupName.toLocaleLowerCase()} er på intervjuet.{' '}
        <FontAwesomeIcon icon="check-circle" color="green" /> indikerer at det
        minst er én fra {internalGroupName.toLocaleLowerCase()} på intervjuet.
      </MessageBox>
      <Title order={2}>Førstevalg</Title>
      <Paper p="md">
        <ApplicantsTable applicants={firstPriorities} />
      </Paper>
      <Title order={2}>Andrevalg</Title>
      <Paper p="md">
        <ApplicantsTable applicants={secondPriorities} />
      </Paper>{' '}
      <Title order={2}>Tredjevalg</Title>
      <Paper p="md">
        <ApplicantsTable applicants={thirdPriorities} />
      </Paper>
    </Wrapper>
  )
}
