import { useMutation } from '@apollo/client'
import { ErrorMessage } from '@hookform/error-message'
import { yupResolver } from '@hookform/resolvers/yup'
import { UserMultiSelect, UserSelect } from 'components/Select'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import * as yup from 'yup'
import { summaryTypeChoices } from './conts'
import { CREATE_SUMMARY } from './mutations'
import {
  CreateSummaryMutationReturns,
  CreateSummaryMutationVariables,
  SummaryType,
} from './types'

type SummaryInput = {
  participants: string[]
  reporter: string
  contents: string
  grouping: string
  date: string
  type: SummaryType
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
    participants: yup
      .array()
      .of(yup.string())
      .required('Noen må være tilstede'),
    reporter: yup.string().required('Må ha en referent'),
    contents: yup.string().required('Må ha innhold'),
    type: yup.string(),
    date: yup.date().required('Referat må ha en dato'),
  })

  const {
    register,
    handleSubmit,
    setValue,
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
    await createSummary({
      variables: {
        input: {
          contents: data.contents,
          participants: data.participants,
          reporter: data.reporter,
          type: data.type,
          date: data.date,
        },
      },
    })
  }

  return (
    <Wrapper>
      <Title>Nytt referat</Title>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        Referent:
        <UserSelect setUserCallback={handleUpdateReporter} />
        <UserMultiSelect setUsersCallback={handleUpdateParticipants} />
        <ErrorMessage
          errors={errors}
          name="reporter"
          render={({ message }) => <p>{message}</p>}
        />
        <select {...register('type')}>
          {summaryTypeChoices.map((choice, i) => (
            <option value={choice.value} key={i}>
              {choice.label}
            </option>
          ))}
        </select>
        <input placeholder="YYYY-MM-DD" {...register('date')} />
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
