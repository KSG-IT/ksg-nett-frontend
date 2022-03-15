import { useQuery } from '@apollo/client'
import { FullPageError } from 'components/FullPageComponents'
import { FullContentLoader } from 'components/Loading'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import { AllInternalGroupsAcceptingApplicantsReturns } from '../types'
import { ALL_INTERNAL_GROUP_APPLICANT_DATA } from './queries'
const Wrapper = styled.div`
  ${props => props.theme.layout.default};
`

const Title = styled.h1``

const InternalGroupStatsContainer = styled.div`
  padding: 10px;
  background-color: ${props => props.theme.colors.white};
  margin: 5px;

  &:hover {
    cursor: pointer;
    opacity: 0.8;
  }
`

export const DiscussionDashboard: React.VFC = () => {
  /**
   * This component should show show some overall progress statistics of the different groups
   * Should also list shortcuts to internal group dashboards
   * Shows a profile card of the applicant and their values
   * Can also show statistics for the group on the top
   *
   */
  const history = useHistory()
  const { data, loading, error } =
    useQuery<AllInternalGroupsAcceptingApplicantsReturns>(
      ALL_INTERNAL_GROUP_APPLICANT_DATA
    )

  if (error) return <FullPageError />

  if (loading || !data) return <FullContentLoader />

  const handleRedirect = (internalGroupId: string) => {
    history.push(`admissions/internal-group-discussion/${internalGroupId}`)
  }

  const { allInternalGroupApplicantData } = data
  return (
    <Wrapper>
      <Title>Fordelingsmøtet</Title>
      {allInternalGroupApplicantData.map(data => (
        // Should probably be a new query which shows different stats
        <InternalGroupStatsContainer
          key={data.internalGroup.id}
          onClick={() => handleRedirect(data.internalGroup.id)}
        >
          <h3>{data.internalGroup.name}</h3>
          <span>Søkere bestemt så langt {data.currentProgress}</span>
          <span>Antall søkere de skal ta opp {data.positionsToFill}</span>

          {/* HEre we can display number of applicants.
          How many they are taking up and how far they have left. By clicking on it
          we can move to a detail page which is a panel listing applicants they ahve to cover
           and can mark as "do want" or sent furthe ralong*/}
        </InternalGroupStatsContainer>
      ))}
    </Wrapper>
  )
}
