import { Button, Group, Select, TextInput } from '@mantine/core'
import { DatePickerInput, TimeInput } from '@mantine/dates'
import { showNotification } from '@mantine/notifications'
import { LocationValues, locationOptions } from 'modules/schedules/consts'
import { useShiftMutations } from 'modules/schedules/mutations.hooks'
import { NORMALIZED_SHIFTS_FROM_RANGE_QUERY } from 'modules/schedules/queries'
import { ShiftNode } from 'modules/schedules/types.graphql'
import { Controller, useForm } from 'react-hook-form'
import { format } from 'util/date-fns'
import { SHIFT_DETAIL_QUERY } from '../ShiftCardModal'

interface EditShiftFormProps {
  shift: ShiftNode
}

export interface ShiftFormValues {
  name: string
  location: LocationValues | null
  day: Date
  startTime: string
  endTime: string
}

export const EditShiftForm: React.FC<EditShiftFormProps> = ({ shift }) => {
  const start = new Date(shift.datetimeStart)
  const end = new Date(shift.datetimeEnd)
  const { patchShift } = useShiftMutations()

  const {
    register,
    control,
    handleSubmit,
    formState: { isDirty },
  } = useForm<ShiftFormValues>({
    mode: 'onChange',
    defaultValues: {
      name: shift.name,
      location: shift.location,
      day: start,
      startTime: format(start, 'HH:mm'),
      endTime: format(end, 'HH:mm'),
    },
  })

  const onSubmit = (values: ShiftFormValues) => {
    const { day: startDate } = values

    const datetimeStart = new Date(startDate)
    const [startHours, startMinutes] = values.startTime.split(':')
    const [endHours, endMinutes] = values.endTime.split(':')

    datetimeStart.setHours(Number(startHours))
    datetimeStart.setMinutes(Number(startMinutes))
    datetimeStart.setSeconds(0)
    datetimeStart.setMilliseconds(0)

    const datetimeEnd = new Date(startDate)
    datetimeEnd.setHours(Number(endHours))
    datetimeEnd.setMinutes(Number(endMinutes))
    datetimeEnd.setSeconds(0)
    datetimeEnd.setMilliseconds(0)

    if (datetimeEnd < datetimeStart) {
      datetimeEnd.setDate(datetimeEnd.getDate() + 1)
    }

    patchShift({
      variables: {
        id: shift.id,
        input: {
          name: values.name,
          location: values.location,
          datetimeStart: datetimeStart,
          datetimeEnd: datetimeEnd,
        },
      },
      refetchQueries: [SHIFT_DETAIL_QUERY, NORMALIZED_SHIFTS_FROM_RANGE_QUERY],
      onCompleted() {
        showNotification({
          title: 'Vakt oppdatert',
          message: '',
        })
      },
      onError({ message }) {
        showNotification({
          title: 'Noe gikk galt',
          message,
        })
      },
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <TextInput {...register('name')} label="Navn på vakt" />
      <Controller
        name="location"
        control={control}
        render={({ field }) => (
          <Select label="Lokale" {...field} data={locationOptions} />
        )}
      />
      <Controller
        name="day"
        control={control}
        render={({ field }) => <DatePickerInput {...field} />}
      />
      <Group>
        <TimeInput label="Starttid" {...register('startTime')} />
        <TimeInput label="Sluttid" {...register('endTime')} />
      </Group>
      <Button type="submit" mt="md" disabled={!isDirty}>
        Lagre
      </Button>
    </form>
  )
}
