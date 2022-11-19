import { createStyles, MultiSelect, Select, TextInput } from '@mantine/core'
import { DatePicker, TimeInput, TimeRangeInput } from '@mantine/dates'
import { locationOptions } from 'modules/schedules/consts'
import { ShiftNode } from 'modules/schedules/types.graphql'
import { Controller, useForm } from 'react-hook-form'
import { AsyncShiftSlotSelect } from '../Form/AsyncShiftSlotSelect'

interface ShiftCardModalProps {
  shift: ShiftNode
}

export const ShiftCardModal: React.FC<ShiftCardModalProps> = ({ shift }) => {
  const { classes } = useStyles()
  const start = new Date(shift.datetimeStart)
  const { register, control } = useForm({
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
      <form>
        <TextInput {...register('title')} label="Navn på vakt" />
        {/* <Select {...reigster("")}  label="Dag i uken"/> */}
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
        <AsyncShiftSlotSelect shift={shift} />
      </form>
    </div>
  )
}

const useStyles = createStyles((theme, _params, getRef) => ({
  container: {
    width: '100%',
  },
}))
