import { useMutation, useQuery } from '@apollo/client'
import { ErrorMessage } from '@hookform/error-message'
import { yupResolver } from '@hookform/resolvers/yup'
import { FullPage404, FullPageError } from 'components/FullPageErrorComponents'
import { FullContentLoader } from 'components/Loading'
import { UserMultiSelect, UserSelect } from 'components/Select'
import { format } from 'date-fns'
import { SubmitHandler, useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import { useHistory, useParams } from 'react-router-dom'
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
interface EditSummaryParams {
  summaryId: string
}

export const EditSummary: React.VFC = () => {
  const { summaryId } = useParams<EditSummaryParams>()
  const history = useHistory()

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
      history.push(`/summaries/${summary.id}`)
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
        Referent:
        <UserSelect
          userId={getValues('reporter')}
          setUserCallback={handleUpdateReporter}
        />
        <UserMultiSelect
          users={getValues('participants')}
          setUsersCallback={handleUpdateParticipants}
        />
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
