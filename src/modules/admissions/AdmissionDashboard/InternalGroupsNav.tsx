import { useQuery } from '@apollo/client'
import { Card } from 'components/Card'
import { FullContentLoader } from 'components/Loading'
import { INTERNAL_GROUPS_ACCEPTING_APPLICANTS } from 'modules/admissions/queries'
import { InternalGroupsAcceptingApplicantsReturns } from 'modules/admissions/types'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`

const Title = styled.h2``

const InternalGroupCardsContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 10px;
`

const InternalGroupCard = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  font-size: 24px;
  font-weight: bold;

  &:hover {
    opacity: 0.8;
    cursor: pointer;
  }
`
export const InternalGroupsNav: React.VFC = () => {
  /**
   * Here we query and list internal groups that have external applicants and add shortcuts to their respetive applicant dasboards
   */
  const history = useHistory()
  const { error, loading, data } =
    useQuery<InternalGroupsAcceptingApplicantsReturns>(
      INTERNAL_GROUPS_ACCEPTING_APPLICANTS
    )

  const handleRedirect = (internalGroupId: string) => {
    history.push(`admissions/internal-group-applicants/${internalGroupId}`)
  }

  if (error) return null

  if (loading || !data) return <FullContentLoader />

  const { internalGroupsAcceptingApplicants } = data

  return (
    <Wrapper>
      <Title>Gjenger som har eksternopptak</Title>
      <InternalGroupCardsContainer>
        {internalGroupsAcceptingApplicants.map(group => (
          <Card>
            <InternalGroupCard
              onClick={() => {
                handleRedirect(group.id)
              }}
            >
              {group.name}
            </InternalGroupCard>
          </Card>
        ))}
      </InternalGroupCardsContainer>
    </Wrapper>
  )
}
