import {
  Checkbox,
  Group,
  Input,
  NumberInput,
  SegmentedControl,
  Select,
  Stack,
} from '@mantine/core'
import { Controller, useFormContext, useWatch } from 'react-hook-form'
import { DefaultAvailabilityValues, v2RoleOptions } from '../../consts'
import { AVAILABILITY_OPTIONS, RosterFormValues } from '../../roster'

const AVAILABILITY_HELP: Record<DefaultAvailabilityValues, string> = {
  AVAILABLE: 'Uten svar kan personen jobbe alle vakter.',
  OPT_IN: 'Uten svar jobber personen ikke. Personen melder seg på vakter.',
}

// Role, default and cap: the fields a roster rule and a roster row share.
// Use it inside a FormProvider with RosterFormValues.
export const RosterValuesFields: React.FC = () => {
  const { control } = useFormContext<RosterFormValues>()
  const [availability, noCap] = useWatch({
    control,
    name: ['defaultAvailability', 'noCap'],
  })

  return (
    <Stack gap="sm">
      <Controller
        control={control}
        name="role"
        render={({ field, fieldState }) => (
          <Select
            label="Rolle"
            description="Autofyll setter personen på vakter med denne rollen"
            data={v2RoleOptions}
            searchable
            allowDeselect={false}
            value={field.value ?? null}
            onChange={field.onChange}
            error={fieldState.error?.message}
          />
        )}
      />
      <Controller
        control={control}
        name="defaultAvailability"
        render={({ field }) => (
          <Input.Wrapper
            label="Standard"
            description={AVAILABILITY_HELP[availability]}
          >
            <SegmentedControl
              fullWidth
              mt={4}
              data={AVAILABILITY_OPTIONS}
              value={field.value}
              onChange={field.onChange}
            />
          </Input.Wrapper>
        )}
      />
      <Group align="flex-end" gap="sm" wrap="nowrap">
        <Controller
          control={control}
          name="shiftCap"
          render={({ field, fieldState }) => (
            <NumberInput
              label="Maks vakter"
              description="Fra siste opptak"
              min={0}
              allowDecimal={false}
              disabled={noCap}
              value={field.value ?? ''}
              onChange={value =>
                field.onChange(typeof value === 'number' ? value : null)
              }
              error={fieldState.error?.message}
              style={{ flex: 1 }}
            />
          )}
        />
        <Controller
          control={control}
          name="noCap"
          render={({ field }) => (
            <Checkbox
              label="Ingen grense"
              mb={10}
              checked={field.value}
              onChange={event => field.onChange(event.currentTarget.checked)}
            />
          )}
        />
      </Group>
    </Stack>
  )
}
