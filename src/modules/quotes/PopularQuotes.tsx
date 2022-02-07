import { useQuery } from '@apollo/client'
import { FullPageError } from 'components/FullPageComponents'
import { FullContentLoader } from 'components/Loading'
import styled from 'styled-components'
import { PopularQuotesReturns, QuoteCard } from '.'
import { POPULAR_QUOTES_QUERY } from './queries'
const Wrapper = styled.div`
  ${props => props.theme.layout.default};
  display: grid;
  grid-template-areas:
    'title .'
    'current-semester all-time';
  grid-template-rows: 40px auto;
  grid-template-columns: 300px 300px;
  gap: 15px;
  overflow-y: scroll;

  ${props => props.theme.media.mobile} {
    grid-template-areas:
      'title'
      'current-semester'
      'all-time';
    grid-template-columns: 300px;
  }
`

const CurrentSemesterContainer = styled.div`
  grid-area: current-semester;
  display: flex;
  flex-direction: column;
  gap: 10px;
`

const AllTimeContainer = styled.div`
  grid-area: all-time;
  display: flex;
  flex-direction: column;
  gap: 10px;
`

const ContainerTitle = styled.h2``

const Title = styled.h1`
  grid-area: title;
  margin: 0;
`

export const PopularQuotes: React.VFC = () => {
  const { data, loading, error } =
    useQuery<PopularQuotesReturns>(POPULAR_QUOTES_QUERY)

  if (error) return <FullPageError />

  if (loading || !data) return <FullContentLoader />

  const {
    popularQuotesAllTime,
    popularQuotesCurrentSemester,
    currentSemesterShorthand,
  } = data

  return (
    <Wrapper>
      <Title>Populære sitater</Title>
      <CurrentSemesterContainer>
        <ContainerTitle>{currentSemesterShorthand}</ContainerTitle>
        {popularQuotesCurrentSemester.map(quote => (
          <QuoteCard quote={quote} key={quote.id} />
        ))}
      </CurrentSemesterContainer>
      <AllTimeContainer>
        <ContainerTitle>Siden tidenes morgen</ContainerTitle>
        {popularQuotesAllTime.map(quote => (
          <QuoteCard quote={quote} key={quote.id} displaySemester />
        ))}
      </AllTimeContainer>
    </Wrapper>
  )
}
