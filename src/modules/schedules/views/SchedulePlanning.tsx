import { useMutation, useQuery } from '@apollo/client'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  ActionIcon,
  Badge,
  Button,
  Card,
  Group,
  Modal,
  SimpleGrid,
  Stack,
  Table,
  Text,
} from '@mantine/core'
import { DatePickerInput, DateTimePicker } from '@mantine/dates'
import { modals } from '@mantine/modals'
import { showNotification } from '@mantine/notifications'
import { IconEdit, IconMail, IconPlus, IconTrash } from '@tabler/icons-react'
import { FullPageError } from 'components/FullPageComponents'
import { FullContentLoader } from 'components/Loading'
import { MessageBox } from 'components/MessageBox'
import { addDays, parseISO } from 'date-fns'
import { useState } from 'react'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { useParams } from 'react-router-dom'
import { format } from 'util/date-fns'
import { ManagersOnly, SchedulePageHeader } from '../components/ScheduleTabs'
import { PlanningPeriodStatusValues } from '../consts'
import {
  CREATE_PLANNING_PERIOD_MUTATION,
  DELETE_PLANNING_PERIOD_MUTATION,
  SEND_PLANNING_PERIOD_REMINDER_MUTATION,
  UPDATE_PLANNING_PERIOD_MUTATION,
} from '../mutations'
import {
  PlanningPeriodFormValues,
  planningPeriodFormSchema,
  planningPeriodLabel,
  planningStatusLabel,
  schedulePlanningQueryOptions,
  spareCandidates,
  toGraphqlDateTime,
} from '../planning'
import { SCHEDULE_PLANNING_QUERY } from '../queries'
import { parseShiftRole } from '../util'
import type {
  CreatePlanningPeriodReturns,
  CreatePlanningPeriodVariables,
  DeletePlanningPeriodReturns,
  PlanningPeriodInput,
  PlanningPeriodNode,
  ScheduleIdVariables,
  SchedulePlanningReturns,
  SendPlanningPeriodReminderReturns,
  SendPlanningPeriodReminderVariables,
  UpdatePlanningPeriodReturns,
  UpdatePlanningPeriodVariables,
} from '../types.graphql'

const statusColor: Record<PlanningPeriodStatusValues, string> = {
  [PlanningPeriodStatusValues.OPEN]: 'green',
  [PlanningPeriodStatusValues.CLOSED]: 'orange',
  [PlanningPeriodStatusValues.PUBLISHED]: 'blue',
}

const SchedulePlanning: React.FC = () => {
  const { id } = useParams() as { id: string }
  const [editing, setEditing] = useState<PlanningPeriodNode | null>(null)
  const [creating, setCreating] = useState(false)
  const { data, loading, error } = useQuery<
    SchedulePlanningReturns,
    ScheduleIdVariables
  >(SCHEDULE_PLANNING_QUERY, {
    variables: { id },
    ...schedulePlanningQueryOptions,
  })
  const [remove] = useMutation<DeletePlanningPeriodReturns, { id: string }>(
    DELETE_PLANNING_PERIOD_MUTATION,
    { refetchQueries: [SCHEDULE_PLANNING_QUERY] }
  )

  const schedule = data?.schedule
  if (error) return <FullPageError />
  if (!schedule) return loading ? <FullContentLoader /> : <FullPageError />
  if (!schedule.canManage) {
    return (
      <Stack gap="md">
        <SchedulePageHeader schedule={schedule} page="Planlegging" />
        <ManagersOnly />
      </Stack>
    )
  }

  function deletePeriod(period: PlanningPeriodNode) {
    modals.openConfirmModal({
      title: 'Slette planleggingsperioden?',
      children: (
        <Text size="sm">
          {planningPeriodLabel(period.dateFrom, period.dateTo)} slettes. Svarene
          på vaktene beholdes.
        </Text>
      ),
      labels: { confirm: 'Slett', cancel: 'Avbryt' },
      confirmProps: { color: 'red' },
      onConfirm: () =>
        remove({
          variables: { id: period.id },
          onCompleted: () =>
            showNotification({
              message: 'Perioden ble slettet',
              color: 'green',
            }),
          onError: ({ message }) =>
            showNotification({ title: 'Noe gikk galt', message, color: 'red' }),
        }),
    })
  }

  return (
    <Stack gap="md" maw={1100}>
      <SchedulePageHeader schedule={schedule} page="Planlegging" />
      <Group justify="space-between" align="center">
        <Text c="dimmed" size="sm">
          Åpne en periode før medlemmene skal oppgi tilgjengelighet.
        </Text>
        <Button
          leftSection={<IconPlus size={16} />}
          onClick={() => setCreating(true)}
        >
          Ny periode
        </Button>
      </Group>
      {schedule.planningPeriods.length === 0 ? (
        <MessageBox type="info">
          Det finnes ingen planleggingsperioder ennå.
        </MessageBox>
      ) : (
        schedule.planningPeriods.map(period => (
          <PlanningPeriodCard
            key={period.id}
            period={period}
            onEdit={() => setEditing(period)}
            onDelete={() => deletePeriod(period)}
          />
        ))
      )}
      {(creating || editing) && (
        <PlanningPeriodForm
          key={editing?.id ?? 'new'}
          scheduleId={schedule.id}
          period={editing}
          opened
          onClose={() => {
            setCreating(false)
            setEditing(null)
          }}
        />
      )}
    </Stack>
  )
}

const PlanningPeriodCard: React.FC<{
  period: PlanningPeriodNode
  onEdit: () => void
  onDelete: () => void
}> = ({ period, onEdit, onDelete }) => {
  const [sendReminder, { loading }] = useMutation<
    SendPlanningPeriodReminderReturns,
    SendPlanningPeriodReminderVariables
  >(SEND_PLANNING_PERIOD_REMINDER_MUTATION, {
    refetchQueries: [SCHEDULE_PLANNING_QUERY],
  })
  const stats = period.responseStats
  const canRemind = period.status === PlanningPeriodStatusValues.OPEN

  function remind() {
    sendReminder({
      variables: { planningPeriodId: period.id },
      onCompleted: ({ sendPlanningPeriodReminder }) =>
        showNotification({
          title: 'Påminnelse sendt',
          message: `E-post ble sendt til ${sendPlanningPeriodReminder.recipients} medlemmer.`,
          color: 'green',
        }),
      onError: ({ message }) =>
        showNotification({ title: 'Noe gikk galt', message, color: 'red' }),
    })
  }

  function confirmRemind() {
    modals.openConfirmModal({
      title: 'Send påminnelse om vaktønsker?',
      children: (
        <Text size="sm">
          Er du sikker på at du vil sende påminnelse på e-post til alle
          tilgjengelige medlemmer på rosteren?
        </Text>
      ),
      labels: { confirm: 'Send påminnelse', cancel: 'Avbryt' },
      confirmProps: { color: 'blue' },
      onConfirm: remind,
    })
  }

  return (
    <Card withBorder radius="md" padding="md">
      <Stack gap="sm">
        <Group justify="space-between" align="flex-start">
          <div>
            <Group gap="xs">
              <Text fw={700}>
                {planningPeriodLabel(period.dateFrom, period.dateTo)}
              </Text>
              <Badge color={statusColor[period.status]}>
                {planningStatusLabel(period.status)}
              </Badge>
            </Group>
            <Text size="sm" c="dimmed">
              Frist: {format(parseISO(period.deadline), 'd. MMMM, HH:mm')}
            </Text>
          </div>
          <Group gap={4}>
            <ActionIcon
              variant="subtle"
              aria-label="Endre periode"
              onClick={onEdit}
            >
              <IconEdit size={18} />
            </ActionIcon>
            {period.status !== PlanningPeriodStatusValues.PUBLISHED && (
              <ActionIcon
                color="red"
                variant="subtle"
                aria-label="Slett periode"
                onClick={onDelete}
              >
                <IconTrash size={18} />
              </ActionIcon>
            )}
          </Group>
        </Group>
        {stats && <ResponseStats stats={stats} />}
        {period.slotCoverage.length > 0 && (
          <CoverageTable rows={period.slotCoverage} />
        )}
        <Group justify="space-between">
          <Text size="xs" c="dimmed">
            {period.reminderSentAt
              ? `Sist sendt ${format(
                  parseISO(period.reminderSentAt),
                  'd. MMM, HH:mm'
                )}`
              : 'Ingen påminnelse sendt'}
          </Text>
          {canRemind && (
            <Button
              size="compact-sm"
              variant="default"
              leftSection={<IconMail size={14} />}
              loading={loading}
              onClick={confirmRemind}
            >
              Send påminnelse
            </Button>
          )}
        </Group>
      </Stack>
    </Card>
  )
}

const ResponseStats: React.FC<{
  stats: NonNullable<PlanningPeriodNode['responseStats']>
}> = ({ stats }) => (
  <Stack gap="xs">
    <SimpleGrid cols={{ base: 2, sm: 4 }} spacing="xs">
      <Stat label="På rosteren" value={stats.rosterCount} />
      <Stat label="Har svart" value={stats.usersWithAnswers} />
      <Stat
        label="Påmelding"
        value={`${stats.optInWithInterest} / ${stats.optInCount}`}
      />
    </SimpleGrid>
    <Text fw={600} size="sm">
      Svar på vakter
    </Text>
    <SimpleGrid cols={{ base: 2, sm: 3 }} spacing="xs">
      <Stat label="Kan jobbe" value={stats.available} />
      <Stat label="Ønsker å jobbe" value={stats.interested} />
      <Stat label="Kan ikke jobbe" value={stats.unavailable} />
    </SimpleGrid>
  </Stack>
)

const Stat: React.FC<{ label: string; value: string | number }> = ({
  label,
  value,
}) => (
  <div>
    <Text size="xs" c="dimmed">
      {label}
    </Text>
    <Text fw={700}>{value}</Text>
  </div>
)

const CoverageTable: React.FC<{ rows: PlanningPeriodNode['slotCoverage'] }> = ({
  rows,
}) => (
  <Table withTableBorder withColumnBorders highlightOnHover fz="sm">
    <Table.Caption>
      Vakter med færrest tilgjengelige
      {rows.length > 5 && ` (viser 5 av ${rows.length})`}
    </Table.Caption>
    <Table.Thead>
      <Table.Tr>
        <Table.Th>Vakt</Table.Th>
        <Table.Th>Rolle</Table.Th>
        <Table.Th>Ledig / kandidater</Table.Th>
        <Table.Th>Interesserte</Table.Th>
      </Table.Tr>
    </Table.Thead>
    <Table.Tbody>
      {rows.slice(0, 5).map(row => (
        <Table.Tr key={`${row.shift.id}-${row.role}`}>
          <Table.Td>
            {row.shift.name} ·{' '}
            {format(parseISO(row.shift.datetimeStart), 'EEE d. MMM, HH:mm')}
          </Table.Td>
          <Table.Td>{parseShiftRole(row.role)}</Table.Td>
          <Table.Td c={spareCandidates(row) < 0 ? 'red' : undefined}>
            {row.openSlotCount} / {row.candidateCount}
          </Table.Td>
          <Table.Td>{row.interestedCount}</Table.Td>
        </Table.Tr>
      ))}
    </Table.Tbody>
  </Table>
)

const PlanningPeriodForm: React.FC<{
  scheduleId: string
  period: PlanningPeriodNode | null
  opened: boolean
  onClose: () => void
}> = ({ scheduleId, period, opened, onClose }) => {
  const today = format(new Date(), 'yyyy-MM-dd')
  const defaultTo = format(addDays(new Date(), 13), 'yyyy-MM-dd')
  const defaultDeadline = addDays(new Date(), 7).toISOString()

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<PlanningPeriodFormValues>({
    resolver: zodResolver(planningPeriodFormSchema),
    defaultValues: {
      dateFrom: period?.dateFrom ?? today,
      dateTo: period?.dateTo ?? defaultTo,
      deadline: period?.deadline ?? defaultDeadline,
    },
  })

  const dateFrom = useWatch({ control, name: 'dateFrom' })

  const [create, { loading: creating }] = useMutation<
    CreatePlanningPeriodReturns,
    CreatePlanningPeriodVariables
  >(CREATE_PLANNING_PERIOD_MUTATION, {
    refetchQueries: [SCHEDULE_PLANNING_QUERY],
  })
  const [update, { loading: updating }] = useMutation<
    UpdatePlanningPeriodReturns,
    UpdatePlanningPeriodVariables
  >(UPDATE_PLANNING_PERIOD_MUTATION, {
    refetchQueries: [SCHEDULE_PLANNING_QUERY],
  })
  const loading = creating || updating

  function onSubmit(values: PlanningPeriodFormValues) {
    const input: PlanningPeriodInput = {
      dateFrom: values.dateFrom,
      dateTo: values.dateTo,
      deadline: toGraphqlDateTime(values.deadline),
    }
    const options = {
      onCompleted: () => {
        showNotification({
          message: period ? 'Perioden ble endret' : 'Perioden ble opprettet',
          color: 'green',
        })
        onClose()
      },
      onError: ({ message }: { message: string }) =>
        showNotification({ title: 'Noe gikk galt', message, color: 'red' }),
    }
    if (period) update({ variables: { id: period.id, input }, ...options })
    else create({ variables: { input: { scheduleId, ...input } }, ...options })
  }

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={period ? 'Endre periode' : 'Ny planleggingsperiode'}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack>
          <Controller
            control={control}
            name="dateFrom"
            render={({ field }) => (
              <DatePickerInput
                label="Fra dato"
                value={field.value}
                onChange={value => field.onChange(value ?? '')}
                error={errors.dateFrom?.message}
                required
              />
            )}
          />
          <Controller
            control={control}
            name="dateTo"
            render={({ field }) => (
              <DatePickerInput
                label="Til dato"
                value={field.value}
                onChange={value => field.onChange(value ?? '')}
                minDate={dateFrom ? parseISO(dateFrom) : undefined}
                error={errors.dateTo?.message}
                required
              />
            )}
          />
          <Controller
            control={control}
            name="deadline"
            render={({ field }) => (
              <DateTimePicker
                label="Frist for tilgjengelighet"
                value={field.value}
                onChange={value => field.onChange(value ?? '')}
                error={errors.deadline?.message}
                required
              />
            )}
          />
          <Group justify="flex-end">
            <Button variant="default" onClick={onClose}>
              Avbryt
            </Button>
            <Button loading={loading} type="submit">
              {period ? 'Lagre' : 'Opprett'}
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  )
}

export default SchedulePlanning
