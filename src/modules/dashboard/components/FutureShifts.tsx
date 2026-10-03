import { useQuery } from '@apollo/client'
import { Anchor, Group, Paper, Skeleton, Stack, Text } from '@mantine/core'
import {
  MyShiftList,
  NextShiftCard,
} from 'modules/schedules/components/MyShifts'
import { previewShifts } from 'modules/schedules/myShifts'
import { MY_SHIFTS_UPCOMING } from 'modules/schedules/queries'
import { MyShiftsUpcomingReturns } from 'modules/schedules/types.graphql'
import { Link } from 'react-router-dom'
import { useMe } from 'util/hooks'

const LATER_COUNT = 3

// The same query as Mine vakter. It is not part of the dashboard query, so
// the 10-second poll there does not load every slot of every shift.
export const FutureShifts: React.FC = () => {
  const me = useMe()
  const { data, loading, error } = useQuery<MyShiftsUpcomingReturns>(
    MY_SHIFTS_UPCOMING,
    { fetchPolicy: 'cache-and-network' }
  )

  const { next, later, more } = previewShifts(
    data?.myUpcomingShifts ?? [],
    LATER_COUNT
  )

  return (
    <Stack gap="xs">
      <Group justify="space-between">
        <Text c="dimmed" fw={700}>
          Neste vakter
        </Text>
        <Anchor component={Link} to="/schedules/me" size="sm">
          {more > 0 ? `Alle mine vakter (${more} til)` : 'Alle mine vakter'}
        </Anchor>
      </Group>
      {loading && !data ? (
        <Skeleton height={96} radius="md" />
      ) : error && !data ? (
        <Paper withBorder radius="md" p="md">
          <Text c="dimmed" size="sm">
            Kunne ikke hente vaktene dine.
          </Text>
        </Paper>
      ) : !next ? (
        <Paper withBorder radius="md" p="md">
          <Text c="dimmed" size="sm" ta="center">
            Du har ingen kommende vakter.
          </Text>
        </Paper>
      ) : (
        <>
          <NextShiftCard shift={next} meId={me.id} now={new Date()} />
          {later.length > 0 && (
            <MyShiftList
              groups={[{ key: 'later', label: 'Senere', shifts: later }]}
              meId={me.id}
            />
          )}
        </>
      )}
    </Stack>
  )
}
