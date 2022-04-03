import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button, Container, Select, Textarea, TextInput } from '@mantine/core'
import { DatePicker, TimeRangeInput } from '@mantine/dates'
import { add, setHours, setMinutes } from 'date-fns'
import { Controller, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useCreateShiftMutation } from './api/create-shift'
import { useScheduleQuery } from './api/query'

interface FormData {
  name: string
  description: string
  schedule: string
  shift_date: Date
  shift_duration: [Date, Date]
}

const formatFormData = (data: FormData) => {
  const [start, end]: [Date, Date] = data.shift_duration
  const shift_start = setHours(
    setMinutes(data.shift_date, start.getMinutes()),
    start.getHours()
  )
  let shift_end = setHours(
    setMinutes(data.shift_date, end.getMinutes()),
    end.getHours()
  )
  if (end < start) {
    shift_end = add(shift_end, { days: 1 })
  }
  const { name, description, schedule } = data
  const variables = {
    name,
    description,
    schedule,
    start: shift_start,
    end: shift_end,
  }
  return variables
}

const CreateShiftTab = () => {
  const { register, control, handleSubmit } = useForm<FormData>()
  const { data, loading } = useScheduleQuery()
  const [mutate] = useCreateShiftMutation()

  // Make the dateinput and stuff a component in the future
  return (
    <Container>
      <form
        onSubmit={handleSubmit(formData => {
          const variables = formatFormData(formData)
          const promise = mutate({ variables })
          toast.promise(promise, {
            loading: 'Submitting new shift',
            success: 'Successfully added new shift',
            error: 'Something went wrong',
          })
        })}
      >
        <TextInput
          {...register('name')}
          label="Name"
          placeholder="Edgar kveld"
        />
        <Textarea
          {...register('description')}
          label="Description"
          placeholder="Beskrivelse"
          autosize
        />
        <Controller
          name="schedule"
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              disabled={loading}
              label="Schedule"
              placeholder={loading ? 'Loading...' : 'Schedule'}
              searchable
              clearable
              data={
                data
                  ? data.allSchedules.map(({ id, name }) => ({
                      value: id,
                      label: name,
                    }))
                  : []
              }
            />
          )}
        />
        <Controller
          name="shift_date"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <DatePicker
              {...field}
              placeholder="Pick date"
              label="Shift date"
              icon={<FontAwesomeIcon icon="calendar" size="1x" />}
            />
          )}
        />
        <Controller
          name="shift_duration"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <TimeRangeInput {...field} label="Shift duration" clearable />
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Container>
  )
}

export default CreateShiftTab
