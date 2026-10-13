import { Divider, Group, Paper, Stack, Text } from '@mantine/core'
import { DayShift } from '../../allShifts'
import { coworkerShift, daysUntil, mySlot, relativeDay } from '../../myShifts'
import { parseShiftRole } from '../../util'
import { ShiftDetails } from '../AllShifts/ShiftDetails'
import { shiftTime } from '../AllShifts/shiftDisplay'
import { LocationBadge } from '../LocationBadge'
import { DateBlock } from './DateBlock'

interface NextShiftCardProps {
  shift: DayShift
  meId: string
  now: Date
}

export const NextShiftCard: React.FC<NextShiftCardProps> = ({
  shift,
  meId,
  now,
}) => {
  const slot = mySlot(shift, meId)
  const coworkers = coworkerShift(shift, meId)

  return (
    <Paper withBorder radius="md" p="md">
      <Group wrap="nowrap" align="center" gap="md">
        <DateBlock
          date={new Date(shift.datetimeStart)}
          variant="accent"
          showMonth
          size={60}
        />
        <Stack gap={4} style={{ minWidth: 0 }}>
          <Text size="xs" fw={700} c="samfundet-red" tt="uppercase">
            Neste vakt · {relativeDay(daysUntil(shift, now))}
          </Text>
          <Group gap="xs" wrap="wrap">
            <Text fw={700} size="lg">
              {shift.name}
            </Text>
            <LocationBadge location={shift.location} />
            {slot && (
              <Text size="sm" c="dimmed">
                {parseShiftRole(slot.role)}
              </Text>
            )}
          </Group>
          <Text
            size="sm"
            fw={600}
            style={{ fontVariantNumeric: 'tabular-nums' }}
          >
            {shiftTime(shift)}
          </Text>
        </Stack>
      </Group>
      {coworkers.slots.length > 0 && (
        <>
          <Divider my="sm" />
          <Text size="xs" fw={700} c="dimmed" tt="uppercase" mb="xs">
            Du jobber med
          </Text>
          <ShiftDetails shift={coworkers} />
        </>
      )}
    </Paper>
  )
}
