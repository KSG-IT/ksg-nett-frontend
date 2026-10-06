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
import { format, formatDistanceToNowStrict, isPast, parseISO } from 'date-fns'
import { nb } from 'date-fns/locale'
import { useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { DefaultAvailabilityValues } from '../consts'
import {
  answerFor,
  answerValue,
  type AvailabilityAnswer,
} from '../availability'
import { SET_SHIFT_INTEREST_MUTATION } from '../mutations'
import { MY_OPEN_PLANNING_PERIODS_QUERY } from '../queries'
import type {
  MyOpenPlanningPeriodsReturns,
  PlanningPeriodNode,
  ShiftNode,
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
  const periods = data?.myOpenPlanningPeriods ?? []
  const selectedId = new URLSearchParams(location.search).get('period')
  const ordered = useMemo(
    () => [...periods].sort((a, b) => a.deadline.localeCompare(b.deadline)),
    [periods]
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
  period: PlanningPeriodNode
  selected: boolean
  refetch: () => Promise<unknown>
}> = ({ period, selected, refetch }) => {
  const defaultAvailability = period.myDefaultAvailability
  const deadline = parseISO(period.deadline)
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
                {period.schedule.name} · {periodLabel(period)}
              </Text>
              <Badge color="green">Åpen</Badge>
            </Group>
            <Text size="sm" c="dimmed">
              {dateRange(period)} · {period.shifts.length} vakter
            </Text>
            <Text size="sm" c={isPast(deadline) ? 'red' : 'orange'} fw={600}>
              Frist{' '}
              {format(deadline, "EEEE d. MMMM 'kl.' HH:mm", { locale: nb })} ·{' '}
              {formatDistanceToNowStrict(deadline, { locale: nb })} igjen
            </Text>
          </div>
          <Badge
            leftSection={<IconCheck size={12} />}
            variant="light"
            color="green"
          >
            Svar lagres automatisk
          </Badge>
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
                  {format(parseISO(date), 'EEEE d. MMMM', { locale: nb })}
                </Text>
                <Stack gap={0} className={classes.shiftList}>
                  {shifts.map(shift => (
                    <ShiftAnswer
                      key={shift.id}
                      shift={shift}
                      defaultAvailability={defaultAvailability}
                      disabled={isPast(deadline)}
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
  shift: ShiftNode
  defaultAvailability?: string | null
  disabled: boolean
  onStale: () => Promise<unknown>
}> = ({ shift, defaultAvailability, disabled, onStale }) => {
  const [save, { loading }] = useMutation(SET_SHIFT_INTEREST_MUTATION)
  const [error, setError] = useState(false)
  const [answer, setAnswer] = useState<Answer>(
    answerFor(shift.myInterest?.interestType, defaultAvailability)
  )
  const [note, setNote] = useState(shift.myInterest?.note ?? '')
  const [noteOpen, setNoteOpen] = useState(Boolean(shift.myInterest?.note))
  function persist(next: Answer, nextNote = note) {
    const previous = answer
    const previousNote = note
    setAnswer(next)
    setNote(nextNote)
    setError(false)
    save({
      variables: {
        shiftId: shift.id,
        interestType: answerValue(
          next,
          defaultAvailability,
          shift.myInterest?.interestType
        ),
        note: nextNote,
      },
    }).catch(async () => {
      setAnswer(previous)
      setNote(previousNote)
      setError(true)
      await onStale()
    })
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
          {format(parseISO(shift.datetimeStart), 'EEE d. MMM', { locale: nb })}{' '}
          · {format(parseISO(shift.datetimeStart), 'HH:mm')}–
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
        disabled={disabled || loading}
        onChange={value => persist(value as Answer)}
        aria-label={`Svar for ${shift.name}`}
      />
      <Group gap="xs" align="center">
        {!noteOpen && (
          <Text
            component="button"
            className={classes.noteButton}
            onClick={() => setNoteOpen(true)}
            disabled={disabled}
          >
            + Notat
          </Text>
        )}
        {noteOpen && (
          <TextInput
            value={note}
            onChange={event => setNote(event.currentTarget.value)}
            onBlur={() => persist(answer, note)}
            placeholder="Kort notat til Personal"
            maxLength={255}
            disabled={disabled || loading}
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

function periodLabel(period: PlanningPeriodNode) {
  return `${format(parseISO(period.dateFrom), 'd. MMM', {
    locale: nb,
  })}–${format(parseISO(period.dateTo), 'd. MMM', { locale: nb })}`
}
function dateRange(period: PlanningPeriodNode) {
  return `${format(parseISO(period.dateFrom), 'd. MMM', {
    locale: nb,
  })} – ${format(parseISO(period.dateTo), 'd. MMM', { locale: nb })}`
}
function groupByDate(shifts: ShiftNode[]) {
  return shifts.reduce<Record<string, ShiftNode[]>>((groups, shift) => {
    const date = shift.datetimeStart.slice(0, 10)
    ;(groups[date] ??= []).push(shift)
    return groups
  }, {})
}
