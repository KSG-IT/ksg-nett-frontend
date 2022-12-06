import { Button, createStyles, Select, TextInput } from '@mantine/core'
import { DatePicker, TimeRangeInput } from '@mantine/dates'
import { locationOptions, LocationValues } from 'modules/schedules/consts'
import { ShiftNode } from 'modules/schedules/types.graphql'
import { Controller, useForm } from 'react-hook-form'
import { AsyncShiftSlotSelect } from '../Form/AsyncShiftSlotSelect'

interface ShiftCardModalProps {
  shift: ShiftNode
}

export interface ShiftFormValues {
  title: string
  location: LocationValues | null
  day: Date
  time: [Date, Date]
  slots: string[]
}

export const ShiftCardModal: React.FC<ShiftCardModalProps> = ({ shift }) => {
  const { classes } = useStyles()
  const start = new Date(shift.datetimeStart)

  const { register, control, handleSubmit } = useForm<ShiftFormValues>({
    defaultValues: {
      title: shift.name,
      location: shift.location,
      day: start,
      time: [start, new Date(shift.datetimeEnd)] as [Date, Date],
      slots: shift.slots.map(slot => slot.id),
    },
  })

  return (
    <div className={classes.container}>
      {/* TODO: mutate */}
      <form onSubmit={handleSubmit(data => console.log(data))}>
        <TextInput {...register('title')} label="Navn på vakt" />
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
        <AsyncShiftSlotSelect name="slots" shift={shift} control={control} />
        <Button type="submit" mt="md">
          Submit
        </Button>
      </form>
    </div>
  )
}

const useStyles = createStyles((theme, _params, getRef) => ({
  container: {
    width: '100%',
    height: '100%',
  },
}))
