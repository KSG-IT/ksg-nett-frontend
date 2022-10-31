import { useMutation, useQuery } from '@apollo/client'
import { yupResolver } from '@hookform/resolvers/yup'
import { FullPage404, FullPageError } from 'components/FullPageComponents'
import { FullContentLoader } from 'components/Loading'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import { useNavigate, useParams } from 'react-router-dom'
import styled from 'styled-components'
import * as yup from 'yup'
import { PATCH_SUMMARY } from './mutations'
import { SUMMARY_QUERY } from './queries'
import {
  PatchSummaryInput,
  PatchSummaryMutationReturns,
  PatchSummaryMutationVariables,
  SummaryDetailQueryVariables,
  SummaryDetailsQueryReturns,
} from './types'
import { SummaryForm } from './components/SummaryForm/SummaryForm'

interface EditSummaryParams {
  summaryId: string
}

export const EditSummary: React.FC = () => {
  const { summaryId } = useParams<
    keyof EditSummaryParams
  >() as EditSummaryParams
  const navigate = useNavigate()

  // This summary query
  const { data, loading, error } = useQuery<
    SummaryDetailsQueryReturns,
    SummaryDetailQueryVariables
  >(SUMMARY_QUERY, {
    variables: { id: summaryId },
  })

  if (error) return <FullPageError />

  if (loading || !data) return <FullContentLoader />

  const { summary } = data

  if (summary === null) return <FullPage404 />

  return (
    <SummaryForm
      summary={summary}
      onCompletedCallback={() => console.log('HELLO NOOB')}
    />
  )
}
