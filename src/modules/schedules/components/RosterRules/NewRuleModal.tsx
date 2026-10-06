import { zodResolver } from '@hookform/resolvers/zod'
import { Modal, Select, Stack } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { Controller, FormProvider, useForm } from 'react-hook-form'
import { DefaultAvailabilityValues } from '../../consts'
import { useScheduleRosterMutations } from '../../mutations.hooks'
import {
  NewRuleFormValues,
  RULE_MEMBERSHIP_TYPES,
  SelectOption,
  capInput,
  membershipTypeLabel,
  newRuleFormSchema,
} from '../../roster'
import { FormButtons, RosterValuesFields, notifyError } from '../RosterForm'

const TYPE_OPTIONS = RULE_MEMBERSHIP_TYPES.map(type => ({
  value: type,
  label: membershipTypeLabel(type),
}))

interface NewRuleModalProps {
  scheduleId: string
  positions: SelectOption[]
  opened: boolean
  onClose: () => void
}

export const NewRuleModal: React.FC<NewRuleModalProps> = ({
  opened,
  onClose,
  ...form
}) => (
  <Modal opened={opened} onClose={onClose} title="Ny regel">
    {opened && <NewRuleForm onClose={onClose} {...form} />}
  </Modal>
)

interface NewRuleFormProps {
  scheduleId: string
  positions: SelectOption[]
  onClose: () => void
}

const NewRuleForm: React.FC<NewRuleFormProps> = ({
  scheduleId,
  positions,
  onClose,
}) => {
  const form = useForm<NewRuleFormValues>({
    resolver: zodResolver(newRuleFormSchema),
    defaultValues: {
      positionId: '',
      defaultAvailability: DefaultAvailabilityValues.AVAILABLE,
      noCap: true,
      shiftCap: null,
    },
  })
  const { createGrouping, createGroupingLoading } = useScheduleRosterMutations()

  function handleSubmit(values: NewRuleFormValues) {
    createGrouping({
      variables: {
        input: {
          scheduleId,
          internalGroupPositionId: values.positionId,
          positionType: values.positionType,
          role: values.role,
          defaultAvailability: values.defaultAvailability,
          shiftCap: capInput(values),
        },
      },
      onCompleted() {
        showNotification({ message: 'Regelen er lagt til', color: 'green' })
        onClose()
      },
      onError: notifyError,
    })
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <Stack gap="sm">
          <Controller
            control={form.control}
            name="positionId"
            render={({ field, fieldState }) => (
              <Select
                label="Verv"
                data={positions}
                searchable
                value={field.value || null}
                onChange={value => field.onChange(value ?? '')}
                error={fieldState.error?.message}
              />
            )}
          />
          <Controller
            control={form.control}
            name="positionType"
            render={({ field, fieldState }) => (
              <Select
                label="Type"
                description="Medlemskapet personen har i vervet"
                data={TYPE_OPTIONS}
                value={field.value ?? null}
                onChange={field.onChange}
                error={fieldState.error?.message}
              />
            )}
          />
          <RosterValuesFields />
          <FormButtons loading={createGroupingLoading} onCancel={onClose} />
        </Stack>
      </form>
    </FormProvider>
  )
}
