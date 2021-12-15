import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { SubmitHandler, useForm } from 'react-hook-form'
import styled from 'styled-components'
import { SummaryType } from '.'
import { CREATE_SUMMARY } from './mutations'
import { useMutation } from '@apollo/client'
import {
  CreateSummaryMutationReturns,
  CreateSummaryMutationVariables,
} from './types'
import { formatISO } from 'date-fns'
import { useHistory } from 'react-router-dom'
import { UserSelect } from 'components/Select'
import { ErrorMessage } from '@hookform/error-message'

type SummaryInput = {
  participants: String[]
  reporter: String
  contents: String
  summarType: SummaryType
}

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  overflow-y: scroll;
  padding: 32px;
`

const Title = styled.h1``

const TextArea = styled.textarea`
  width: 100%;
  height: 600px;
`

export const CreateSummary = () => {
  const [createSummary] = useMutation<
    CreateSummaryMutationReturns,
    CreateSummaryMutationVariables
  >(CREATE_SUMMARY, {
    refetchQueries: ['AllSummaries'],
    awaitRefetchQueries: true,
    onCompleted({ createSummary }) {
      const { summary } = createSummary
      history.push(`/summaries/${summary.id}`)
    },
  })
  const history = useHistory()

  let schema = yup.object({
    //participants: yup.array().required().min(1, 'Må være et positivt tall'),
    reporter: yup.string().required('Må ha en referent'),
    contents: yup.string().required('Må ha innhold'),
    //summaryType: yup.string(),
  })

  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<SummaryInput>({
    resolver: yupResolver(schema),
  })

  const handleUpdateReporter = (input: string) => {
    setValue('reporter', input)
  }

  const onSubmit: SubmitHandler<SummaryInput> = async data => {
    console.log(data)

    await createSummary({
      variables: {
        input: {
          contents: data.contents,
          participants: ['1'],
          reporter: data.reporter,
          summaryType: 'STYRET',
          date: formatISO(new Date()),
        },
      },
    })
  }

  return (
    <Wrapper>
      <Title>Nytt referat</Title>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        Referent:
        <UserSelect
          reporter={getValues('reporter')}
          setReporterCallback={handleUpdateReporter}
        />
        <ErrorMessage
          errors={errors}
          name="reporter"
          render={({ message }) => <p>{message}</p>}
        />
        {/*
      ToDo:
        - user multiselect for participants
      */}
        <TextArea {...register('contents')} />
        <ErrorMessage
          errors={errors}
          name="contents"
          render={({ message }) => <p>{message}</p>}
        />
        <button type="submit">Lagre referat</button>
      </form>
    </Wrapper>
  )
}
