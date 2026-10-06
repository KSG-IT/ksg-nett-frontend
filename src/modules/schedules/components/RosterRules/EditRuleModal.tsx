import { zodResolver } from '@hookform/resolvers/zod'
import { Modal, Stack } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { FormProvider, useForm } from 'react-hook-form'
import { useScheduleRosterMutations } from '../../mutations.hooks'
import {
  RosterFormValues,
  capInput,
  rosterFormDefaults,
  rosterFormSchema,
} from '../../roster'
import { ScheduleRosterGroupingNode } from '../../types.graphql'
import { FormButtons, RosterValuesFields, notifyError } from '../RosterForm'

interface EditRuleModalProps {
  rule: ScheduleRosterGroupingNode | null
  onClose: () => void
}

export const EditRuleModal: React.FC<EditRuleModalProps> = ({
  rule,
  onClose,
}) => (
  <Modal opened={rule !== null} onClose={onClose} title="Endre regel">
    {rule !== null && (
      <EditRuleForm key={rule.id} rule={rule} onClose={onClose} />
    )}
  </Modal>
)

interface EditRuleFormProps {
  rule: ScheduleRosterGroupingNode
  onClose: () => void
}

const EditRuleForm: React.FC<EditRuleFormProps> = ({ rule, onClose }) => {
  const form = useForm<RosterFormValues>({
    resolver: zodResolver(rosterFormSchema),
    defaultValues: rosterFormDefaults(rule.role, rule),
  })
  const { patchGrouping, patchGroupingLoading } = useScheduleRosterMutations()

  function handleSubmit(values: RosterFormValues) {
    patchGrouping({
      variables: {
        id: rule.id,
        input: {
          role: values.role,
          defaultAvailability: values.defaultAvailability,
          shiftCap: capInput(values),
        },
      },
      onCompleted() {
        showNotification({ message: 'Regelen er endret', color: 'green' })
        onClose()
      },
      onError: notifyError,
    })
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <Stack gap="sm">
          <RosterValuesFields />
          <FormButtons loading={patchGroupingLoading} onCancel={onClose} />
        </Stack>
      </form>
    </FormProvider>
  )
}
