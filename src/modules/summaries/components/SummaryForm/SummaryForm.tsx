import { SummaryNode } from '../../types'
import { useSummaryLogic } from './useSummaryLogic'
import { useSummaryEditAPI } from './SummaryEditAPI'
import { Button, Card, Group, Select, Stack, Textarea } from '@mantine/core'
import { UserMultiSelect, UserSelect } from '../../../../components/Select'
import { useState } from 'react'
import { summaryTypeChoices } from '../../conts'
import { DatePicker } from '@mantine/dates'
import { IconCake, IconCalendar } from '@tabler/icons'

interface SummaryFormProps {
  summary: SummaryNode
  onCompletedCallback: () => void
}

export const UseSummaryForm: React.FC<SummaryFormProps> = ({
  summary,
  onCompletedCallback,
}) => {
  const { form, onSubmit } = useSummaryLogic({
    ...useSummaryEditAPI(summary),
    onCompletedCallback,
  })
  const { formState, register, handleSubmit, getValues, setValue } = form
  const { errors, isSubmitting } = formState
  const [reporter, setReporter] = useState<string>(getValues('reporter'))
  const [participants, setParticipants] = useState<string[]>(
    getValues('participants')
  )

  function handleCallback(values: string[]) {
    setParticipants(values)
    setValue('participants', values)
    console.log('UPDATED PARTICIPANTS', getValues('participants'))
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack>
        <Card>
          <Group>
            <div>
              <label>Referent</label>
              <UserSelect
                userId={reporter}
                setUserCallback={value => {
                  setReporter(value)
                  setValue('reporter', value)
                }}
              />
            </div>
            <div>
              <label>Deltakere</label>
              <UserMultiSelect
                users={participants}
                setUsersCallback={handleCallback}
              />
            </div>
          </Group>
          <Group>
            <div>
              <label>Type referat</label>
              <select {...register('type')}>
                {summaryTypeChoices.map((choice, i) => (
                  <option value={choice.value.toUpperCase()} key={i}>
                    {choice.label.toUpperCase()}
                  </option>
                ))}
              </select>
              <Select
                defaultValue={getValues('type')}
                data={summaryTypeChoices.map(choice => ({
                  label: choice.label.toUpperCase(),
                  value: choice.value.toUpperCase(),
                }))}
                onChange={value => value && console.log(value)}
              />
            </div>
            <div>
              <DatePicker
                label="Referatdato"
                placeholder="Velg en dato"
                icon={<IconCalendar size={14} />}
                error={errors?.date?.message}
                defaultValue={getValues('date')}
                onChange={date => date && setValue('date', new Date(date))}
                allowFreeInput
              />
            </div>
          </Group>
        </Card>
        <Textarea {...register('contents')} />
        <Button disabled={isSubmitting} type={'submit'}>
          Fæddi
        </Button>
      </Stack>
    </form>
  )
}
