import { useQuery } from '@apollo/client'
import { Button, Card, Group, Stack, Text, Title } from '@mantine/core'
import { Breadcrumbs } from 'components/Breadcrumbs'
import { CardTable } from 'components/CardTable'
import { MessageBox } from 'components/MessageBox'
import { useMemo } from 'react'
import { useCurrencyFormatter, useMe } from 'util/hooks'
import { useSociRankedSeasonMutations } from '../mutations.hooks'
import { CURRENT_SEASON_QUERY } from '../queries'
import { RankedSeason } from '../types.graphql'

function getLeaderboardRowStyle(place: number) {
  /**
   * 0-indexed.
   * 0 -> first place [Gold]
   * 1 -> second place [Silver]
   * 2 -> third place [Bronze]
   * 3+ -> No styling
   */
  if (place === 0) {
    return {
      fontWeight: 600,
      color: '#C5A111',
    }
  } else if (place === 1) {
    return {
      fontWeight: 600,
      color: '#A5A4A2',
    }
  } else if (place === 2) {
    return {
      fontWeight: 600,
      color: '#CD7F32',
    }
  } else {
    return undefined
  }
}

const breadcrumbs = [
  { label: 'Hjem', path: '/dashboard' },
  { label: 'Ledertavle', path: '' },
]

const CONFIRM_TEXTS = {
  participate:
    'Er du sikker på at du vil delta? Alle andre deltakere vil kunne se forbruket ditt dette semesteret om du er på topplisten. Samtykke kan ikke trekkes tilbake',
  endSeason: 'Er du sikker på at du vil avslutte sesongen?',
}

const SociRanked = () => {
  const { formatCurrency } = useCurrencyFormatter()
  const { data, loading, error } = useQuery<RankedSeason>(
    CURRENT_SEASON_QUERY,
    { pollInterval: 10_000 }
  )
  const { joinRankedSeason } = useSociRankedSeasonMutations()

  async function handleParticipateInRanked() {
    const confirmation = confirm(CONFIRM_TEXTS.participate)

    if (!confirmation) return

    await joinRankedSeason({ refetchQueries: [CURRENT_SEASON_QUERY] })
  }

  const displayOffSeasonMessage = useMemo(() => {
    return data?.currentRankedSeason.seasonEnd !== null
  }, [data?.currentRankedSeason])

  const firstPlaceName = useMemo(() => {
    const season = data?.currentRankedSeason

    if (!season) return 'vinneren'
    const topTen = data?.currentRankedSeason?.topTen

    if (!topTen) return 'vinneren'

    const firstPlace = topTen[0]

    if (!firstPlace) return 'vinneren'

    return firstPlace.name
  }, [data?.currentRankedSeason.topTen])

  const participateButtonDisabled = useMemo(() => {
    return data?.currentRankedSeason.seasonEnd !== null
  }, [data?.currentRankedSeason])

  if (error) return <span>Error</span>

  if (loading || !data) return <span>Loading</span>

  const { currentRankedSeason } = data

  const isParticipant = data?.currentRankedSeason.isParticipant || false
  const viewTitle = `Societeten ranked sesong ${currentRankedSeason.rankedSeason}`

  if (!isParticipant) {
    return (
      <Stack>
        <Breadcrumbs items={breadcrumbs} />
        <Title>{viewTitle}</Title>
        <MessageBox type="warning">
          For å kunne se ledertavlen må du også delta dette semesteret. Alle
          deltakere kan se forbruket til top 10. Det er for øyeblikket
          <b> {currentRankedSeason.participantCount} deltakere </b>. Samtykke
          nullstilles neste semester.{' '}
          {participateButtonDisabled &&
            'Konkurransen er stengt. Du kan melde deg på neste gang'}
        </MessageBox>
        <Group>
          <Button
            onClick={handleParticipateInRanked}
            disabled={participateButtonDisabled}
          >
            Jeg har kronisk FOMO
          </Button>
        </Group>
      </Stack>
    )
  }

  return (
    <Stack>
      <Breadcrumbs items={breadcrumbs} />
      <Title>{viewTitle}</Title>
      <Group>
        <Card>
          <Title order={4}>Ditt forbruk</Title>
          <Text fz={'xl'}>
            {formatCurrency(currentRankedSeason.seasonExpenditure || 0)}
          </Text>
        </Card>
        <Card>
          <Title order={4}>Plassering</Title>
          <Text fz="xl">
            {currentRankedSeason.placement} av{' '}
            {currentRankedSeason.participantCount}
          </Text>
        </Card>
      </Group>
      {displayOffSeasonMessage && (
        <MessageBox type="info">
          Denne sesongen er nå stengt. Gratulerer til {firstPlaceName}! Du må
          invitere hele ledertavlen til Baksida inn/ut.
        </MessageBox>
      )}
      <CardTable>
        <thead>
          <tr>
            <th>Plass</th>
            <th>Navn</th>
            <th>Forbruk</th>
          </tr>
        </thead>
        <tbody>
          {currentRankedSeason?.topTen?.map((user, index) => (
            <tr key={index} style={getLeaderboardRowStyle(index)}>
              <td>{index + 1}</td>
              <td>{user.name}</td>
              <td>{formatCurrency(user.expenditure)}</td>
            </tr>
          ))}
        </tbody>
      </CardTable>
    </Stack>
  )
}

export default SociRanked
