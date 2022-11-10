import { useMutation } from '@apollo/client'
import { yupResolver } from '@hookform/resolvers/yup'
import {
  Button,
  Card,
  Group,
  Select,
  Stack,
  Textarea,
  Title,
} from '@mantine/core'
import { DatePicker } from '@mantine/dates'
import { Breadcrumbs } from 'components/Breadcrumbs'
import { UserMultiSelect, UserSelect } from 'components/Select'
import { formatISO } from 'date-fns'
import { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import * as yup from 'yup'
import { summaryTypeChoices } from './conts'
import { CREATE_SUMMARY } from './mutations'
import {
  CreateSummaryMutationReturns,
  CreateSummaryMutationVariables,
  SummaryType,
} from './types'

const breadcrumbItems = [
  { label: 'Hjem', path: '/dashboard' },
  { label: 'Referater', path: '/summaries' },
  { label: 'Opprett', path: '/summaries/create' },
]

type SummaryInput = {
  participants: string[]
  reporter: string
  contents: string
  grouping: string
  date: string
  type: SummaryType
}

export const CreateSummary = () => {
  const navigate = useNavigate()
  const [date, setDate] = useState<Date | null>(new Date())
  const [summaryType, setSummaryType] = useState<SummaryType | null>(
    summaryTypeChoices[0].value
  )
  const [createSummary] = useMutation<
    CreateSummaryMutationReturns,
    CreateSummaryMutationVariables
  >(CREATE_SUMMARY, {
    refetchQueries: ['AllSummaries'],
    awaitRefetchQueries: true,
    onCompleted({ createSummary }) {
      const { summary } = createSummary
      navigate(`/summaries/${summary.id}`)
    },
  })

  let schema = yup.object({
    participants: yup
      .array()
      .of(yup.string())
      .required('Noen må være tilstede'),
    reporter: yup.string().required('Må ha en referent'),
    contents: yup.string().required('Må ha innhold'),
  })

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<SummaryInput>({
    resolver: yupResolver(schema),
  })

  const handleUpdateReporter = (input: string) => {
    setValue('reporter', input)
  }

  const handleUpdateParticipants = (input: string[]) => {
    setValue('participants', input)
  }

  const onSubmit: SubmitHandler<SummaryInput> = async data => {
    if (date === null || summaryType === null) return
    toast.promise(
      createSummary({
        variables: {
          input: {
            contents: data.contents,
            participants: data.participants,
            reporter: data.reporter,
            type: summaryType,
            date: formatISO(date), //, "yyyy-MM-dd"),
          },
        },
      }),
      {
        loading: 'Oppretter referat',
        success: 'Referat opprettet',
        error: 'Noe gikk galt',
      }
    )
  }

  return (
    <Stack spacing="sm">
      <Breadcrumbs items={breadcrumbItems} />
      <Title>Opprett referat</Title>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Card>
          <Group>
            <UserSelect
              userId={getValues('reporter')}
              setUserCallback={handleUpdateReporter}
            />
            <UserMultiSelect
              label="Deltakere"
              users={getValues('participants')}
              setUsersCallback={handleUpdateParticipants}
            />
          </Group>
          <Group>
            <Select
              value={summaryType}
              onChange={evt => {
                setSummaryType(evt as SummaryType)
              }}
              label="Type referat"
              data={summaryTypeChoices}
            />

            <DatePicker
              label="Dato"
              value={date}
              maxDate={new Date()}
              onChange={setDate}
            />
          </Group>
        </Card>
        <Textarea label="Innhold" minRows={24} {...register('contents')} />
        <Button color="samfundet-red" type="submit">
          Lagre referat
        </Button>
      </form>
    </Stack>
  )
}
