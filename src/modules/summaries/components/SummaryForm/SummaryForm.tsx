import { SummaryNode } from '../../types'
import { useSummaryLogic } from './useSummaryLogic'
import { useSummaryFormAPI } from './useSummaryFormAPI'
import {
  Button,
  Card,
  Group,
  Select,
  SimpleGrid,
  Stack,
  Textarea,
  Title,
} from '@mantine/core'
import { UserMultiSelect, UserSelect } from '../../../../components/Select'
import { useState } from 'react'
import { summaryTypeChoices } from '../../conts'
import { DatePicker } from '@mantine/dates'
import { IconCalendar } from '@tabler/icons'

interface SummaryFormProps {
  summary?: SummaryNode
  onCompletedCallback: () => void
}

export const SummaryForm: React.FC<SummaryFormProps> = ({
  summary,
  onCompletedCallback,
}) => {
  const { form, onSubmit } = useSummaryLogic({
    ...useSummaryFormAPI(summary),
    onCompletedCallback,
  })

  const { formState, register, handleSubmit, getValues, setValue } = form
  const { errors, isSubmitting } = formState
  const [reporter, setReporter] = useState<string>(getValues('reporter'))
  const [participants, setParticipants] = useState<string[]>(
    getValues('participants')
  )
  const [summaryType, setSummaryType] = useState<string>(getValues('type'))

  function handleCallback(values: string[]) {
    setParticipants(values)
    setValue('participants', values)
  }

  function handleSelectType(value: string) {
    const index = summaryTypeChoices.findIndex(choice => choice.value === value)
    setSummaryType(value)
    setValue('type', summaryTypeChoices[index].value)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack>
        <Card withBorder>
          <SimpleGrid
            cols={2}
            breakpoints={[
              { maxWidth: 755, cols: 1, spacing: 'sm' },
              { maxWidth: 600, cols: 1, spacing: 'sm' },
            ]}
          >
            <div>
              <UserSelect
                withinPortal
                label={
                  <Title order={5} color={'dimmed'}>
                    Referent
                  </Title>
                }
                userId={reporter}
                setUserCallback={value => {
                  setReporter(value)
                  setValue('reporter', value)
                }}
              />

              <Select
                label={
                  <Title order={5} color={'dimmed'}>
                    Type
                  </Title>
                }
                value={summaryType}
                data={summaryTypeChoices}
                error={errors.type?.message}
                onChange={handleSelectType}
                withinPortal
              />
              <div>
                <DatePicker
                  withinPortal
                  label={
                    <Title order={5} color={'dimmed'}>
                      Dato
                    </Title>
                  }
                  placeholder="Velg en dato"
                  icon={<IconCalendar size={14} />}
                  error={errors?.date?.message}
                  defaultValue={getValues('date')}
                  onChange={date => date && setValue('date', new Date(date))}
                  allowFreeInput
                />
              </div>
            </div>
            <UserMultiSelect
              label={
                <Title order={5} color={'dimmed'}>
                  Deltakere
                </Title>
              }
              users={participants}
              setUsersCallback={handleCallback}
            />
          </SimpleGrid>
          <Group></Group>
        </Card>
        <Textarea autosize minRows={5} {...register('contents')} />
        <Button color={'samfundet-red'} disabled={isSubmitting} type={'submit'}>
          Lagre
        </Button>
      </Stack>
    </form>
  )
}
