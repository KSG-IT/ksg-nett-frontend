import { Button, Select, TextInput } from '@mantine/core'
import { DatePicker, TimeRangeInput } from '@mantine/dates'
import { showNotification } from '@mantine/notifications'
import { locationOptions, LocationValues } from 'modules/schedules/consts'
import { useShiftMutations } from 'modules/schedules/mutations.hooks'
import { NORMALIZED_SHIFTS_FROM_RANGE_QUERY } from 'modules/schedules/queries'
import { ShiftNode } from 'modules/schedules/types.graphql'
import { Controller, useForm } from 'react-hook-form'
import { SHIFT_DETAIL_QUERY } from '../ShiftCardModal'

interface EditShiftFormProps {
  shift: ShiftNode
}

export interface ShiftFormValues {
  name: string
  location: LocationValues | null
  day: Date
  time: [Date, Date]
}

export const EditShiftForm: React.FC<EditShiftFormProps> = ({ shift }) => {
  const start = new Date(shift.datetimeStart)
  const { patchShift } = useShiftMutations()

  const {
    register,
    control,
    handleSubmit,
    formState: { isDirty },
  } = useForm<ShiftFormValues>({
    defaultValues: {
      name: shift.name,
      location: shift.location,
      day: start,
      time: [start, new Date(shift.datetimeEnd)] as [Date, Date],
    },
  })

  const onSubmit = (values: ShiftFormValues) => {
    const [start, end] = values.time

    start.setFullYear(values.day.getFullYear())
    start.setMonth(values.day.getMonth())
    start.setDate(values.day.getDate())
    end.setFullYear(values.day.getFullYear())
    end.setMonth(values.day.getMonth())
    end.setDate(values.day.getDate())

    patchShift({
      variables: {
        id: shift.id,
        input: {
          name: values.name,
          location: values.location,
          datetimeStart: start,
          datetimeEnd: end,
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
        render={({ field }) => <DatePicker {...field} label="Vakt start" />}
      />
      <Controller
        name="time"
        control={control}
        render={({ field }) => (
          <TimeRangeInput {...field} label="Vakt varighet" />
        )}
      />
      <Button type="submit" mt="md" disabled={!isDirty}>
        Lagre
      </Button>
    </form>
  )
}
