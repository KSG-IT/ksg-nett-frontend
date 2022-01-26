import { useMutation } from '@apollo/client'
import { ErrorMessage } from '@hookform/error-message'
import { yupResolver } from '@hookform/resolvers/yup'
import { Card } from 'components/Card'
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
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow-y: scroll;
  padding: 32px;

  ${props => props.theme.media.mobile} {
    padding: 16px;
  }
`

const Title = styled.h1`
  margin-bottom: 10px;
`

const FormTop = styled.div`
  display: grid;
  width: 100%;
  height: auto;
  grid-template-areas:
    'title . . .'
    'reporter reporter participants participants'
    'type date . .';
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-row-gap: 10px;
  grid-column-gap: 20px;
  ${props => props.theme.media.mobile} {
    display: flex;
    flex-direction: column;
  }
`

const ReporterContainer = styled.div`
  grid-area: reporter;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
`

const ParticipantsContainer = styled.div`
  grid-area: participants;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
`

const TypeContainer = styled.div`
  grid-area: type;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
`

const DateContainer = styled.div`
  grid-area: date;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
`

const TextArea = styled.textarea`
  grid-area: content;
  width: 100%;
  height: 600px;
  border-radius: 10px;
  padding: 10px;
  outline: none;
  border: none;
  margin: 15px 0;
  box-shadow: ${props => props.theme.shadow.default};
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
      <Title>Rediger referat</Title>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Card>
          <FormTop>
            <ReporterContainer>
              <label>Referent</label>
              <UserSelect
                fullwidth
                userId={getValues('reporter')}
                setUserCallback={handleUpdateReporter}
              />
              <ErrorMessage
                errors={errors}
                name="reporter"
                render={({ message }) => <p>{message}</p>}
              />
            </ReporterContainer>
            <ParticipantsContainer>
              <label>Deltakere</label>
              <UserMultiSelect
                fullwidth
                users={getValues('participants')}
                setUsersCallback={handleUpdateParticipants}
              />
            </ParticipantsContainer>
            <TypeContainer>
              <label>Type referat</label>
              <select {...register('type')}>
                {summaryTypeChoices.map((choice, i) => (
                  <option value={choice.value} key={i}>
                    {choice.label}
                  </option>
                ))}
              </select>
            </TypeContainer>

            <DateContainer>
              <label>Dato</label>
              <input placeholder="YYYY-MM-DD" {...register('date')} />
            </DateContainer>
          </FormTop>
        </Card>

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
