import { Paper, SimpleGrid, Text } from '@mantine/core'
import { RosterSummary, formatAverage } from '../../roster'

interface RosterSummaryTilesProps {
  summary: RosterSummary
}

export const RosterSummaryTiles: React.FC<RosterSummaryTilesProps> = ({
  summary,
}) => {
  const tiles = [
    { label: 'På rosteren', value: String(summary.total) },
    {
      label: 'Tilgjengelig · påmelding',
      value: `${summary.available} · ${summary.optIn}`,
    },
    {
      label: 'Snitt vakter, tilgjengelige',
      value: formatAverage(summary.average),
    },
    { label: 'Påmelding på maks', value: String(summary.optInAtCap) },
  ]
  return (
    <SimpleGrid cols={{ base: 2, sm: 4 }} spacing="sm">
      {tiles.map(tile => (
        <Paper key={tile.label} withBorder radius="md" p="sm">
          <Text size="xs" c="dimmed">
            {tile.label}
          </Text>
          <Text fw={700} size="xl">
            {tile.value}
          </Text>
        </Paper>
      ))}
    </SimpleGrid>
  )
}
