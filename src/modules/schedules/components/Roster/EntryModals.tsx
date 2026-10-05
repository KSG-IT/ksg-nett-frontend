import { zodResolver } from '@hookform/resolvers/zod'
import { Modal, Stack, Text } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { Controller, FormProvider, useForm } from 'react-hook-form'
import { DefaultAvailabilityValues, RoleValues } from '../../consts'
import { useScheduleRosterMutations } from '../../mutations.hooks'
import {
  AddEntryFormValues,
  RosterFormValues,
  addEntryFormSchema,
  capInput,
  rosterFormDefaults,
  rosterFormSchema,
} from '../../roster'
import { ScheduleRosterNode } from '../../types.graphql'
import { FormButtons, RosterValuesFields, notifyError } from '../RosterForm'
import { RosterUserSearch } from './RosterUserSearch'

interface EditEntryModalProps {
  row: ScheduleRosterNode | null
  onClose: () => void
}

export const EditEntryModal: React.FC<EditEntryModalProps> = ({
  row,
  onClose,
}) => (
  <Modal
    opened={row !== null}
    onClose={onClose}
    title={`Endre ${row?.user.fullName ?? ''}`}
  >
    {row !== null && <EditEntryForm key={row.id} row={row} onClose={onClose} />}
  </Modal>
)

interface EditEntryFormProps {
  row: ScheduleRosterNode
  onClose: () => void
}

const EditEntryForm: React.FC<EditEntryFormProps> = ({ row, onClose }) => {
  const form = useForm<RosterFormValues>({
    resolver: zodResolver(rosterFormSchema),
    defaultValues: rosterFormDefaults(row.autofillAs, row),
  })
  const { updateEntry, updateEntryLoading } = useScheduleRosterMutations()

  function handleSubmit(values: RosterFormValues) {
    updateEntry({
      variables: {
        id: row.id,
        input: {
          autofillAs: values.role,
          defaultAvailability: values.defaultAvailability,
          shiftCap: capInput(values),
        },
      },
      onCompleted() {
        showNotification({ message: 'Raden er endret', color: 'green' })
        onClose()
      },
      onError: notifyError,
    })
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <Stack gap="sm">
          <Text size="sm" c="dimmed">
            Synken endrer ikke verdiene etter dette.
          </Text>
          <RosterValuesFields />
          <FormButtons loading={updateEntryLoading} onCancel={onClose} />
        </Stack>
      </form>
    </FormProvider>
  )
}

interface AddEntryModalProps {
  scheduleId: string
  // Users on the roster cannot be added again
  rosterUserIds: string[]
  opened: boolean
  onClose: () => void
}

export const AddEntryModal: React.FC<AddEntryModalProps> = ({
  opened,
  onClose,
  ...form
}) => (
  <Modal opened={opened} onClose={onClose} title="Legg til person">
    {opened && <AddEntryForm onClose={onClose} {...form} />}
  </Modal>
)

interface AddEntryFormProps {
  scheduleId: string
  rosterUserIds: string[]
  onClose: () => void
}

const AddEntryForm: React.FC<AddEntryFormProps> = ({
  scheduleId,
  rosterUserIds,
  onClose,
}) => {
  const form = useForm<AddEntryFormValues>({
    resolver: zodResolver(addEntryFormSchema),
    defaultValues: {
      userId: '',
      role: RoleValues.BARTENDER,
      defaultAvailability: DefaultAvailabilityValues.AVAILABLE,
      noCap: true,
      shiftCap: null,
    },
  })
  const { addEntry, addEntryLoading } = useScheduleRosterMutations()

  function handleSubmit(values: AddEntryFormValues) {
    addEntry({
      variables: {
        input: {
          scheduleId,
          userId: values.userId,
          autofillAs: values.role,
          defaultAvailability: values.defaultAvailability,
          shiftCap: capInput(values),
        },
      },
      onCompleted() {
        showNotification({ message: 'Personen er lagt til', color: 'green' })
        onClose()
      },
      onError: notifyError,
    })
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <Stack gap="sm">
          <Text size="sm" c="dimmed">
            En person som er lagt til manuelt, blir på rosteren så lenge
            personen er medlem.
          </Text>
          <Controller
            control={form.control}
            name="userId"
            render={({ field, fieldState }) => (
              <RosterUserSearch
                value={field.value || null}
                onChange={value => field.onChange(value ?? '')}
                excludedIds={rosterUserIds}
                error={fieldState.error?.message}
              />
            )}
          />
          <RosterValuesFields />
          <FormButtons loading={addEntryLoading} onCancel={onClose} />
        </Stack>
      </form>
    </FormProvider>
  )
}
