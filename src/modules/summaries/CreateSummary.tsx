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

type SummaryInput = {
  participants: String[]
  referrer: String
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
    // participants: yup.number().required().min(1, 'Må være et positivt tall'),
    // referrer: yup.string().notRequired(),
    contents: yup.string(),
    //summaryType: yup.string(),
  })

  const { register, handleSubmit } = useForm<SummaryInput>({
    resolver: yupResolver(schema),
  })

  const onSubmit: SubmitHandler<SummaryInput> = async data => {
    await createSummary({
      variables: {
        input: {
          contents: data.contents,
          participants: ['1'],
          reporter: '1',
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
        {/*
      ToDo:
        - User search select to select referrerr
        - user multiselect for participants
      */}

        <TextArea {...register('contents')} />
        <button type="submit">Lagre referat</button>
      </form>
    </Wrapper>
  )
}
