import { useQuery } from '@apollo/client'
import { Group, SimpleGrid, Stack, Title } from '@mantine/core'
import { FullPageError } from 'components/FullPageComponents'
import { FullContentLoader } from 'components/Loading'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'
import { PopularQuotesReturns, QuoteCard } from '.'
import { QuotesTabs } from './components/QuotesTabs'
import { POPULAR_QUOTES_QUERY } from './queries'

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
    <Stack>
      <Group position="apart">
        <Title order={2} color="dimmed">
          Populære sitater
        </Title>
        <QuotesTabs />
      </Group>
      <Stack>
        <Title order={3}>{currentSemesterShorthand}</Title>
        <SimpleGrid cols={2}>
          {popularQuotesCurrentSemester.map(quote => (
            <QuoteCard quote={quote} key={quote.id} />
          ))}
        </SimpleGrid>
      </Stack>
      <AllTimeContainer>
        <Title order={3}>Siden tidenes morgen</Title>
        <SimpleGrid cols={2}>
          {popularQuotesAllTime.map(quote => (
            <QuoteCard quote={quote} key={quote.id} displaySemester />
          ))}
        </SimpleGrid>
      </AllTimeContainer>
    </Stack>
  )
}
