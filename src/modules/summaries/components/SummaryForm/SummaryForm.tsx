import {
  Button,
  Card,
  SimpleGrid,
  Stack,
  TextInput,
  Title,
} from '@mantine/core'
import { DatePicker } from '@mantine/dates'
import { RichTextEditor } from '@mantine/tiptap'
import { IconCalendar } from '@tabler/icons'
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
  const [participants, setParticipants] = useState<string[]>(
    getValues('participants')
  )

  function handleCallback(values: string[]) {
    setParticipants(values)
    setValue('participants', values)
  }

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
              <div>
                <InternalGroupSelect
                  withOtherOption
                  setInternalGroupCallback={value =>
                    setValue('internalGroup', value)
                  }
                />
              </div>

              <div>
                <TextInput
                  label="Tittel"
                  description="Trengs bare om man velger 'Annet'"
                  {...register('title')}
                  disabled={!(watch('internalGroup') === 'other')}
                />
              </div>

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
        </Card>
        {/* <Textarea autosize minRows={24} {...register('contents')} /> */}
        <RichTextEditor editor={editor}>
          <RichTextEditor.Toolbar sticky stickyOffset={60}>
            <RichTextEditor.ControlsGroup>
              <RichTextEditor.Bold />
              <RichTextEditor.Italic />
              <RichTextEditor.Underline />
              <RichTextEditor.Strikethrough />
              <RichTextEditor.ClearFormatting />
              <RichTextEditor.Highlight />
              <RichTextEditor.Code />
            </RichTextEditor.ControlsGroup>

            <RichTextEditor.ControlsGroup>
              <RichTextEditor.H1 />
              <RichTextEditor.H2 />
              <RichTextEditor.H3 />
              <RichTextEditor.H4 />
            </RichTextEditor.ControlsGroup>

            <RichTextEditor.ControlsGroup>
              <RichTextEditor.Blockquote />
              <RichTextEditor.Hr />
              <RichTextEditor.BulletList />
              <RichTextEditor.OrderedList />
              <RichTextEditor.Subscript />
              <RichTextEditor.Superscript />
            </RichTextEditor.ControlsGroup>

            <RichTextEditor.ControlsGroup>
              <RichTextEditor.Link />
              <RichTextEditor.Unlink />
            </RichTextEditor.ControlsGroup>

            <RichTextEditor.ControlsGroup>
              <RichTextEditor.AlignLeft />
              <RichTextEditor.AlignCenter />
              <RichTextEditor.AlignJustify />
              <RichTextEditor.AlignRight />
            </RichTextEditor.ControlsGroup>
          </RichTextEditor.Toolbar>

          <RichTextEditor.Content />
        </RichTextEditor>
        <Button color={'samfundet-red'} disabled={isSubmitting} type={'submit'}>
          Lagre
        </Button>
      </Stack>
    </form>
  )
}
