import { useMutation, useQuery } from '@apollo/client'
import {
  Alert,
  Badge,
  Card,
  Group,
  SegmentedControl,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core'
import {
  IconAlertCircle,
  IconCalendarEvent,
  IconCheck,
} from '@tabler/icons-react'
import { Breadcrumbs } from 'components/Breadcrumbs'
import { FullPageError } from 'components/FullPageComponents'
import { FullContentLoader } from 'components/Loading'
import { isBefore, parseISO } from 'date-fns'
import { useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { format, formatDistanceStrict } from 'util/date-fns'
import { useNow } from 'util/hooks'
import { DefaultAvailabilityValues } from '../consts'
import {
  answerFor,
  answerValue,
  localDate,
  weekRange,
  type AvailabilityAnswer,
} from '../availability'
import { SET_SHIFT_INTEREST_MUTATION } from '../mutations'
import { MY_OPEN_PLANNING_PERIODS_QUERY } from '../queries'
import type {
  MyOpenPlanningPeriodsReturns,
  MyPlanningPeriodNode,
  MyPlanningShiftNode,
} from '../types.graphql'
import classes from './MyAvailability.module.css'

type Answer = AvailabilityAnswer
const breadcrumbsItems = [
  { label: 'Hjem', path: '/dashboard' },
  { label: 'Vakter', path: '/schedules/all-shifts' },
  { label: 'Min tilgjengelighet', path: '' },
]

const answerLabels: Record<Answer, string> = {
  INTERESTED: 'Vil gjerne',
  AVAILABLE: 'Kan',
  UNAVAILABLE: 'Kan ikke',
}

export const MyAvailability: React.FC = () => {
  const location = useLocation()
  const { data, loading, error, refetch } =
    useQuery<MyOpenPlanningPeriodsReturns>(MY_OPEN_PLANNING_PERIODS_QUERY, {
      fetchPolicy: 'cache-and-network',
    })
  const selectedId = new URLSearchParams(location.search).get('period')
  const ordered = [...(data?.myOpenPlanningPeriods ?? [])].sort((a, b) =>
    a.deadline.localeCompare(b.deadline)
  )
  if (error) return <FullPageError />
  if (loading && !data) return <FullContentLoader />
  return (
    <Stack gap="lg" maw={1100} className={classes.page}>
      <Breadcrumbs items={breadcrumbsItems} />
      <div>
        <Title order={1}>Min tilgjengelighet</Title>
        <Text c="dimmed" mt={4}>
          Marker vakter du vil ha, kan ta eller ikke kan ta. Endringer lagres
          med en gang.
        </Text>
      </div>
      {ordered.length === 0 ? (
        <Alert
          icon={<IconCalendarEvent size={18} />}
          color="blue"
          title="Ingen åpne perioder"
        >
          Det er ingen planleggingsperioder du kan svare på akkurat nå.
        </Alert>
      ) : (
        ordered.map(period => (
          <PeriodCard
            key={period.id}
            period={period}
            selected={period.id === selectedId}
            refetch={refetch}
          />
        ))
      )}
    </Stack>
  )
}

const PeriodCard: React.FC<{
  period: MyPlanningPeriodNode
  selected: boolean
  refetch: () => Promise<unknown>
}> = ({ period, selected, refetch }) => {
  // Re-render while the page is open, so the deadline passes on screen too
  const now = useNow()
  const defaultAvailability = period.myDefaultAvailability
  const deadline = parseISO(period.deadline)
  const closed = !isBefore(now, deadline)
  const deadlineLabel = format(deadline, "EEEE d. MMMM 'kl.' HH:mm")
  const remaining = formatDistanceStrict(deadline, now)
  const groups = groupByDate(period.shifts)
  const counts = period.shifts.reduce(
    (result, shift) => {
      result[answerFor(shift.myInterest?.interestType, defaultAvailability)]++
      return result
    },
    { INTERESTED: 0, AVAILABLE: 0, UNAVAILABLE: 0 } as Record<Answer, number>
  )
  return (
    <Card
      withBorder
      radius="md"
      padding="lg"
      className={selected ? classes.selected : undefined}
    >
      <Stack gap="md">
        <Group justify="space-between" align="flex-start" wrap="nowrap">
          <div>
            <Group gap="xs">
              <Text fw={700} size="lg">
                {period.schedule.name} ·{' '}
                {weekRange(period.dateFrom, period.dateTo)}
              </Text>
              <Badge color={closed ? 'gray' : 'green'}>
                {closed ? 'Stengt' : 'Åpen'}
              </Badge>
            </Group>
            <Text size="sm" c="dimmed">
              {format(parseISO(period.dateFrom), 'd. MMM')} –{' '}
              {format(parseISO(period.dateTo), 'd. MMM')} ·{' '}
              {period.shifts.length} vakter
            </Text>
            <Text size="sm" c={closed ? 'red' : 'orange'} fw={600}>
              {closed
                ? `Fristen gikk ut ${deadlineLabel}. Svarene kan ikke endres.`
                : `Frist ${deadlineLabel} · ${remaining} igjen`}
            </Text>
          </div>
          {!closed && (
            <Badge
              leftSection={<IconCheck size={12} />}
              variant="light"
              color="green"
            >
              Svar lagres automatisk
            </Badge>
          )}
        </Group>
        {!defaultAvailability ? (
          <Alert icon={<IconAlertCircle size={18} />} color="orange">
            Du er ikke lenger på rosteren for denne perioden. Svarene kan ikke
            endres.
          </Alert>
        ) : (
          <>
            <Group gap="xs">
              <Badge color="blue">{counts.INTERESTED} vil gjerne</Badge>
              <Badge color="gray">{counts.AVAILABLE} kan</Badge>
              <Badge color="orange">{counts.UNAVAILABLE} kan ikke</Badge>
              <Text size="sm" c="dimmed">
                Ingen svar betyr «
                {defaultAvailability === DefaultAvailabilityValues.OPT_IN
                  ? 'Ikke påmeldt'
                  : 'Kan'}
                ».
              </Text>
            </Group>
            {Object.entries(groups).map(([date, shifts]) => (
              <div key={date} className={classes.dayGroup}>
                <Text fw={700} mb="xs">
                  {format(parseISO(date), 'EEEE d. MMMM')}
                </Text>
                <Stack gap={0} className={classes.shiftList}>
                  {shifts.map(shift => (
                    <ShiftAnswer
                      key={shift.id}
                      shift={shift}
                      defaultAvailability={defaultAvailability}
                      disabled={closed}
                      onStale={refetch}
                    />
                  ))}
                </Stack>
              </div>
            ))}
          </>
        )}
      </Stack>
    </Card>
  )
}

const ShiftAnswer: React.FC<{
  shift: MyPlanningShiftNode
  defaultAvailability?: string | null
  disabled: boolean
  onStale: () => Promise<unknown>
}> = ({ shift, defaultAvailability, disabled, onStale }) => {
  const [save] = useMutation(SET_SHIFT_INTEREST_MUTATION)
  const [error, setError] = useState(false)
  // Saves for one shift go one at a time. The backend has several workers,
  // so two saves in flight can be stored in the wrong order.
  const queue = useRef<Promise<unknown>>(Promise.resolve())
  const [pending, setPending] = useState(0)
  const saved = shift.myInterest
  const [answer, setAnswer] = useState<Answer>(
    answerFor(saved?.interestType, defaultAvailability)
  )
  const [note, setNote] = useState(saved?.note ?? '')
  const [noteOpen, setNoteOpen] = useState(Boolean(saved?.note))

  // A save or a refetch changes the server answer. Show it, so the next
  // answerValue call compares against what is on screen. Wait until no save
  // is queued, so an earlier response does not undo a later click.
  const savedKey = `${saved?.interestType ?? ''}|${saved?.note ?? ''}`
  const [syncedKey, setSyncedKey] = useState(savedKey)
  if (savedKey !== syncedKey && pending === 0) {
    setSyncedKey(savedKey)
    setAnswer(answerFor(saved?.interestType, defaultAvailability))
    setNote(saved?.note ?? '')
  }

  function persist(next: Answer, nextNote = note) {
    const previous = answer
    const previousNote = note
    setAnswer(next)
    setNote(nextNote)
    setError(false)
    setPending(count => count + 1)
    const variables = {
      shiftId: shift.id,
      interestType: answerValue(
        next,
        defaultAvailability,
        saved?.interestType,
        nextNote
      ),
      note: nextNote,
    }
    queue.current = queue.current
      .then(() => save({ variables }))
      .catch(async () => {
        setAnswer(previous)
        setNote(previousNote)
        setError(true)
        await onStale()
      })
      .finally(() => setPending(count => count - 1))
  }

  // Save the note only when it changed. A blur without a change must not
  // send a save, because the save would race with a click on the answer.
  function handleNoteBlur() {
    if (note.trim() === (saved?.note ?? '').trim()) return
    persist(answer, note)
  }

  const data = [
    { value: 'INTERESTED', label: answerLabels.INTERESTED },
    { value: 'AVAILABLE', label: 'Kan' },
    {
      value: 'UNAVAILABLE',
      label:
        defaultAvailability === DefaultAvailabilityValues.OPT_IN
          ? 'Ikke påmeldt'
          : answerLabels.UNAVAILABLE,
    },
  ]
  return (
    <div className={classes.shift}>
      <div className={classes.shiftMeta}>
        <Text fw={600}>
          {format(parseISO(shift.datetimeStart), 'EEE d. MMM')} ·{' '}
          {format(parseISO(shift.datetimeStart), 'HH:mm')}–
          {format(parseISO(shift.datetimeEnd), 'HH:mm')}
        </Text>
        <Text size="sm" c="dimmed">
          {shift.name}
        </Text>
      </div>
      <SegmentedControl
        fullWidth
        value={answer}
        data={data}
        disabled={disabled}
        onChange={value => persist(value as Answer)}
        aria-label={`Svar for ${shift.name}`}
      />
      <Group gap="xs" align="center">
        {!noteOpen && !disabled && (
          <Text
            component="button"
            className={classes.noteButton}
            onClick={() => setNoteOpen(true)}
          >
            + Notat
          </Text>
        )}
        {noteOpen && (
          <TextInput
            value={note}
            onChange={event => setNote(event.currentTarget.value)}
            onBlur={handleNoteBlur}
            placeholder="Kort notat til Personal"
            maxLength={255}
            disabled={disabled}
            className={classes.noteInput}
          />
        )}
        {error && (
          <Text size="xs" c="red">
            Lagring feilet. Prøv igjen.
          </Text>
        )}
      </Group>
    </div>
  )
}

function groupByDate(shifts: MyPlanningShiftNode[]) {
  return shifts.reduce<Record<string, MyPlanningShiftNode[]>>(
    (groups, shift) => {
      const date = localDate(shift.datetimeStart)
      const group = (groups[date] ??= [])
      group.push(shift)
      return groups
    },
    {}
  )
}
