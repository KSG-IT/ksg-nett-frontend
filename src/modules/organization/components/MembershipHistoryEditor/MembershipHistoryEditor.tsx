import { useMutation, useQuery } from '@apollo/client'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  ActionIcon,
  Alert,
  Badge,
  Button,
  Card,
  Group,
  Select,
  SimpleGrid,
  Stack,
  Text,
} from '@mantine/core'
import { DatePickerInput } from '@mantine/dates'
import { modals } from '@mantine/modals'
import { showNotification } from '@mantine/notifications'
import { IconInfoCircle, IconPlus, IconTrash } from '@tabler/icons-react'
import 'dayjs/locale/nb'
import { FullPageError } from 'components/FullPageComponents'
import { FullContentLoader } from 'components/Loading'
import { internalGroupPositionTypeOptions } from 'modules/organization/consts'
import {
  semesterShorthand,
  validateMembershipHistory,
} from 'modules/organization/membershipHistory'
import { SET_USER_MEMBERSHIP_HISTORY_MUTATION } from 'modules/organization/mutations'
import { USER_MEMBERSHIP_HISTORY_QUERY } from 'modules/organization/queries'
import {
  InternalGroupPositionType,
  SetUserMembershipHistoryReturns,
  SetUserMembershipHistoryVariables,
  UserMembershipHistoryReturns,
  UserMembershipHistoryVariables,
} from 'modules/organization/types.graphql'
import { useMemo } from 'react'
import { Controller, useFieldArray, useForm, useWatch } from 'react-hook-form'
import {
  optionalIsoDate,
  requiredIsoDate,
  requiredString,
} from 'util/validation'
import { z } from 'zod'

const FUNCTIONARY_USER_TYPE = 'Funksjonær'

type Positions = UserMembershipHistoryReturns['allInternalGroupPositions']

function historySchema(positions: Positions) {
  const internalPositionIds = new Set(
    positions
      .filter(position => position.internalGroup.type === 'INTERNAL_GROUP')
      .map(position => position.id)
  )

  return z
    .object({
      rows: z.array(
        z.object({
          id: z.string().optional(),
          positionId: requiredString('Velg et verv'),
          type: z.enum(InternalGroupPositionType, { error: 'Velg en type' }),
          dateJoined: requiredIsoDate('Velg startdato'),
          dateEnded: optionalIsoDate(),
        })
      ),
    })
    .superRefine((data, ctx) => {
      const errors = validateMembershipHistory(
        data.rows.map(row => ({
          dateJoined: row.dateJoined,
          dateEnded: row.dateEnded ?? null,
          inInternalGroup: internalPositionIds.has(row.positionId),
        }))
      )
      errors.forEach(({ index, message }) =>
        ctx.addIssue({
          code: 'custom',
          message,
          path: ['rows', index, 'dateEnded'],
        })
      )
    })
}

type HistorySchema = ReturnType<typeof historySchema>
type HistoryFormInput = z.input<HistorySchema>
type HistoryFormOutput = z.output<HistorySchema>

interface MembershipHistoryEditorProps {
  userId: string
  onClose: () => void
}

export const MembershipHistoryEditor: React.FC<
  MembershipHistoryEditorProps
> = ({ userId, onClose }) => {
  const { data, loading, error } = useQuery<
    UserMembershipHistoryReturns,
    UserMembershipHistoryVariables
  >(USER_MEMBERSHIP_HISTORY_QUERY, {
    variables: { id: userId },
    fetchPolicy: 'network-only',
  })

  if (error) return <FullPageError />
  if (loading || !data?.user) return <FullContentLoader />

  return (
    <MembershipHistoryForm
      userId={userId}
      user={data.user}
      positions={data.allInternalGroupPositions}
      onClose={onClose}
    />
  )
}

interface MembershipHistoryFormProps {
  userId: string
  user: NonNullable<UserMembershipHistoryReturns['user']>
  positions: Positions
  onClose: () => void
}

const MembershipHistoryForm: React.FC<MembershipHistoryFormProps> = ({
  userId,
  user,
  positions,
  onClose,
}) => {
  const schema = useMemo(() => historySchema(positions), [positions])

  const { control, handleSubmit, setError, formState } = useForm<
    HistoryFormInput,
    unknown,
    HistoryFormOutput
  >({
    resolver: zodResolver(schema),
    defaultValues: {
      rows: user.internalGroupPositionMembershipHistory.map(membership => ({
        id: membership.id,
        positionId: membership.position.id,
        type: membership.type,
        dateJoined: membership.dateJoined,
        dateEnded: membership.dateEnded,
      })),
    },
  })
  const { fields, prepend, remove } = useFieldArray({ control, name: 'rows' })
  const rows = useWatch({ control, name: 'rows' })

  const [setHistory, { loading }] = useMutation<
    SetUserMembershipHistoryReturns,
    SetUserMembershipHistoryVariables
  >(SET_USER_MEMBERSHIP_HISTORY_MUTATION, {
    refetchQueries: ['User', 'ManageUsersDataQuery'],
  })

  // Group the positions by gang in the select
  const positionOptions = useMemo(() => {
    const groups = new Map<string, { value: string; label: string }[]>()
    positions.forEach(position => {
      const items = groups.get(position.internalGroup.name) ?? []
      items.push({ value: position.id, label: position.name })
      groups.set(position.internalGroup.name, items)
    })
    return [...groups].map(([group, items]) => ({ group, items }))
  }, [positions])

  const internalPositionIds = useMemo(
    () =>
      new Set(
        positions
          .filter(position => position.internalGroup.type === 'INTERNAL_GROUP')
          .map(position => position.id)
      ),
    [positions]
  )

  // The editor never changes user types. Show a hint when the current
  // membership and the Funksjonær user type do not match.
  const hasFunctionaryUserType = user.userTypes.edges.some(
    ({ node }) => node.name === FUNCTIONARY_USER_TYPE
  )
  const isCurrentFunctionary = (rows ?? []).some(
    row =>
      row.positionId &&
      internalPositionIds.has(row.positionId) &&
      !row.dateEnded &&
      row.type === InternalGroupPositionType.FUNCTIONARY
  )

  function handleRemove(index: number) {
    modals.openConfirmModal({
      title: 'Fjerne vervet?',
      children: (
        <Text size="sm">
          Vervet slettes fra historikken når du lagrer. Bruk dette bare for å
          rette feil. Når noen slutter, setter du en sluttdato i stedet.
        </Text>
      ),
      labels: { confirm: 'Fjern', cancel: 'Avbryt' },
      confirmProps: { color: 'red' },
      onConfirm: () => remove(index),
    })
  }

  function handleAdd() {
    prepend({
      positionId: '',
      type: InternalGroupPositionType.GANG_MEMBER,
      dateJoined: null,
      dateEnded: null,
    })
  }

  async function onSubmit(values: HistoryFormOutput) {
    const { data: result } = await setHistory({
      variables: {
        userId,
        memberships: values.rows.map(row => ({
          id: row.id,
          positionId: row.positionId,
          type: row.type,
          dateJoined: row.dateJoined,
          dateEnded: row.dateEnded ?? null,
        })),
      },
      onError({ message }) {
        showNotification({ title: 'Noe gikk galt', message, color: 'red' })
      },
    })
    if (!result) return

    const { errors } = result.setUserMembershipHistory
    if (errors.length > 0) {
      errors.forEach(({ index, message }) =>
        setError(`rows.${index}.dateEnded`, { message })
      )
      return
    }

    showNotification({
      title: 'Lagret',
      message: 'Vervhistorikken er oppdatert',
      color: 'green',
    })
    onClose()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <Stack>
        <Text size="sm" c="dimmed">
          Rett opp vervhistorikken til {user.fullName}. Et verv uten sluttdato
          er aktivt. Endringer lagres først når du trykker «Lagre».
        </Text>

        {isCurrentFunctionary !== hasFunctionaryUserType && (
          <Alert color="yellow" icon={<IconInfoCircle />}>
            {isCurrentFunctionary
              ? 'Brukeren er funksjonær, men har ikke brukertypen Funksjonær.'
              : 'Brukeren har brukertypen Funksjonær, men er ikke funksjonær nå.'}{' '}
            Endre brukertypen under Brukertyper. Denne siden endrer ikke
            tilganger.
          </Alert>
        )}

        <Group justify="flex-end">
          <Button
            variant="light"
            leftSection={<IconPlus size={16} />}
            onClick={handleAdd}
          >
            Legg til verv
          </Button>
        </Group>

        {fields.map((field, index) => {
          const rowErrors = formState.errors.rows?.[index]
          return (
            <Card key={field.id} withBorder padding="sm">
              <Group justify="space-between" mb="xs">
                <Text fw={600} size="sm">
                  Verv {index + 1}
                </Text>
                <ActionIcon
                  color="red"
                  aria-label="Fjern verv"
                  onClick={() => handleRemove(index)}
                >
                  <IconTrash size={16} />
                </ActionIcon>
              </Group>
              <SimpleGrid cols={{ base: 1, sm: 2 }}>
                <Controller
                  name={`rows.${index}.positionId`}
                  control={control}
                  render={({ field }) => (
                    <Select
                      label="Verv"
                      searchable
                      data={positionOptions}
                      value={field.value || null}
                      onChange={value => field.onChange(value ?? '')}
                      error={rowErrors?.positionId?.message}
                    />
                  )}
                />
                <Controller
                  name={`rows.${index}.type`}
                  control={control}
                  render={({ field }) => (
                    <Select
                      label="Type"
                      data={internalGroupPositionTypeOptions}
                      value={field.value}
                      onChange={value => value && field.onChange(value)}
                      error={rowErrors?.type?.message}
                    />
                  )}
                />
                <Controller
                  name={`rows.${index}.dateJoined`}
                  control={control}
                  render={({ field }) => (
                    <DatePickerInput
                      label="Startet"
                      placeholder="Velg dato"
                      locale="nb"
                      valueFormat="D. MMMM YYYY"
                      value={field.value}
                      onChange={field.onChange}
                      error={rowErrors?.dateJoined?.message}
                    />
                  )}
                />
                <Controller
                  name={`rows.${index}.dateEnded`}
                  control={control}
                  render={({ field }) => (
                    <DatePickerInput
                      label="Sluttet"
                      placeholder="Aktiv"
                      locale="nb"
                      valueFormat="D. MMMM YYYY"
                      clearable
                      value={field.value ?? null}
                      onChange={field.onChange}
                      error={rowErrors?.dateEnded?.message}
                    />
                  )}
                />
              </SimpleGrid>
              {rows?.[index]?.dateJoined && (
                <Badge variant="light" mt="xs">
                  {semesterShorthand(rows[index].dateJoined ?? null)} –{' '}
                  {semesterShorthand(rows[index].dateEnded ?? null) || 'nå'}
                </Badge>
              )}
            </Card>
          )
        })}

        {fields.length === 0 && (
          <Text c="dimmed" size="sm">
            Brukeren har ingen verv.
          </Text>
        )}

        <Group justify="flex-end">
          <Button variant="default" onClick={onClose}>
            Avbryt
          </Button>
          <Button type="submit" loading={loading}>
            Lagre
          </Button>
        </Group>
      </Stack>
    </form>
  )
}
