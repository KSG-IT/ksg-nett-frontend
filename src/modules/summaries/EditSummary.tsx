import { useMutation, useQuery } from '@apollo/client'
import { ErrorMessage } from '@hookform/error-message'
import { yupResolver } from '@hookform/resolvers/yup'
import { Card } from 'components/Card'
import { FullPage404, FullPageError } from 'components/FullPageComponents'
import { FullContentLoader } from 'components/Loading'
import { UserMultiSelect, UserSelect } from 'components/Select'
import { format } from 'date-fns'
import { SubmitHandler, useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import { useNavigate, useParams } from 'react-router-dom'
import styled from 'styled-components'
import * as yup from 'yup'
import { summaryTypeChoices } from './conts'
import { PATCH_SUMMARY } from './mutations'
import { SUMMARY_QUERY } from './queries'
import {
  PatchSummaryInput,
  PatchSummaryMutationReturns,
  PatchSummaryMutationVariables,
  SummaryDetailQueryVariables,
  SummaryDetailsQueryReturns,
  SummaryType,
} from './types'

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
interface EditSummaryParams {
  summaryId: string
}

export const EditSummary: React.VFC = () => {
  const { summaryId } = useParams<EditSummaryParams>()
  const history = useNavigate()

  // Validation initialization
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

  // Form hook initialization
  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<PatchSummaryInput>({
    resolver: yupResolver(schema),
  })

  // Patch summary mutation
  const [patchSummary] = useMutation<
    PatchSummaryMutationReturns,
    PatchSummaryMutationVariables
  >(PATCH_SUMMARY, {
    refetchQueries: ['AllSummaries', 'Summary'],
    awaitRefetchQueries: true,
    onCompleted({ patchSummary }) {
      toast.success('Referat oppdatert!')
      const { summary } = patchSummary
      navigate(`/summaries/${summary.id}`)
    },
  })

  // This summary query
  const {
    data,
    loading: queryLoading,
    error: queryError,
  } = useQuery<SummaryDetailsQueryReturns, SummaryDetailQueryVariables>(
    SUMMARY_QUERY,
    {
      variables: { id: summaryId },
      onError() {
        toast.error('Noe gikk galt')
      },
      onCompleted(data) {
        const { summary } = data

        if (summary === null) {
          toast.error('Kunne ikke hente referat')
          return
        }

        setValue('contents', summary.contents)
        setValue('type', `${summary.type}`.toUpperCase() as SummaryType)
        setValue(
          'participants',
          summary.participants.map(user => user.id)
        )
        setValue('reporter', summary.reporter.id)
        setValue('date', format(new Date(summary.date), 'yyyy-M-d'))
      },
    }
  )

  // Handlers
  const handleUpdateReporter = (input: string) => {
    setValue('reporter', input)
  }

  const handleUpdateParticipants = (input: string[]) => {
    setValue('participants', input)
  }

  if (queryError) return <FullPageError />

  if (queryLoading || !data) return <FullContentLoader />

  const { summary } = data

  if (summary === null) return <FullPage404 />

  const onSubmit: SubmitHandler<PatchSummaryInput> = async data => {
    await patchSummary({
      variables: {
        id: summaryId,
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
