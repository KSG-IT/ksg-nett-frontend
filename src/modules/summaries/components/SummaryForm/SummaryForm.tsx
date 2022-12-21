import {
  Button,
  Card,
  Group,
  SimpleGrid,
  Stack,
  TextInput,
  Title,
  Text,
  Divider,
} from '@mantine/core'
import { DatePicker } from '@mantine/dates'
import { IconCalendar } from '@tabler/icons'
import { RichTextEditor } from 'components/RichTextEditor'
import {
  InternalGroupSelect,
  UserMultiSelect,
  UserSelect,
} from 'components/Select'
import { SummaryNode } from 'modules/summaries/types'
import { useState } from 'react'
import { useSummaryFormAPI } from './useSummaryFormAPI'
import { useSummaryLogic } from './useSummaryLogic'

interface SummaryFormProps {
  summary?: SummaryNode
  onCompletedCallback: () => void
}

export const SummaryForm: React.FC<SummaryFormProps> = ({
  summary,
  onCompletedCallback,
}) => {
  const { form, editor, onSubmit } = useSummaryLogic({
    ...useSummaryFormAPI(summary, onCompletedCallback),
  })

  const { formState, register, handleSubmit, getValues, setValue, watch } = form
  const { errors, isSubmitting } = formState
  const [reporter, setReporter] = useState<string>(getValues('reporter'))
  const [internalGroup, setInternalGroup] = useState<string>(
    getValues('internalGroup') ?? ''
  )
  const [participants, setParticipants] = useState<string[]>(
    getValues('participants')
  )

  function handleCallback(values: string[]) {
    setParticipants(values)
    setValue('participants', values)
  }

  interface InputLeftLabelProps {
    label: string
    children: React.ReactNode
    description?: string
  }
  const InputLabelWithDescription: React.FC<InputLeftLabelProps> = ({
    label,
    children,
    description,
  }) => (
    <div style={{ maxWidth: '100%' }}>
      <Group position={'apart'}>
        <Title size="sm" color={'dimmed'}>
          {label}
          {description && (
            <Text size="xs" weight={'lighter'} color={'gray.6'}>
              {description}
            </Text>
          )}
        </Title>
        {children}
      </Group>
      <Divider my={'xs'} variant={'dashed'} />
    </div>
  )

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack>
        <Card withBorder style={{ overflow: 'visible' }}>
          <SimpleGrid
            cols={2}
            breakpoints={[
              { maxWidth: 755, cols: 1, spacing: 'sm' },
              { maxWidth: 600, cols: 1, spacing: 'sm' },
            ]}
          >
            <Stack>
              <InputLabelWithDescription label={'Referent'}>
                <UserSelect
                  withinPortal
                  userId={reporter}
                  setUserCallback={value => {
                    setReporter(value)
                    setValue('reporter', value)
                  }}
                />
              </InputLabelWithDescription>
              <InputLabelWithDescription label={'Interngjeng'}>
                <InternalGroupSelect
                  withinPortal
                  withOtherOption
                  internalGroupId={internalGroup}
                  setInternalGroupCallback={value => {
                    setInternalGroup(value)
                    setValue('internalGroup', value)
                  }}
                />
              </InputLabelWithDescription>
              <InputLabelWithDescription
                label={'Tittel'}
                description={"Trengs kun hvis du har valgt 'Annet'"}
              >
                <TextInput
                  {...register('title')}
                  disabled={!(watch('internalGroup') === 'other')}
                />
              </InputLabelWithDescription>
              <InputLabelWithDescription label={'Dato'}>
                <DatePicker
                  withinPortal
                  placeholder="Velg en dato"
                  icon={<IconCalendar size={14} />}
                  error={errors?.date?.message}
                  defaultValue={getValues('date')}
                  onChange={date => date && setValue('date', new Date(date))}
                  allowFreeInput
                />
              </InputLabelWithDescription>
            </Stack>
            <UserMultiSelect
              label={
                <Title mb={'xs'} order={5} color={'dimmed'}>
                  Deltakere
                </Title>
              }
              users={participants}
              setUsersCallback={handleCallback}
            />
          </SimpleGrid>
        </Card>
        <RichTextEditor editor={editor} />
        <Button color={'samfundet-red'} disabled={isSubmitting} type={'submit'}>
          Lagre
        </Button>
      </Stack>
    </form>
  )
}
