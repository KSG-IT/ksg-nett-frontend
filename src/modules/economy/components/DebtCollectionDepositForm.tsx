import { useQuery } from '@apollo/client'
import { FullPageError } from 'components/FullPageComponents'
import { FullContentLoader } from 'components/Loading'
import { ONGOING_DEPOSIT_INTENT_QUERY } from '../views'
import { CreateDepositForm } from './DepositForm'

export const DebtCollectionDepositForm = () => {
  const { data, loading, error } = useQuery(ONGOING_DEPOSIT_INTENT_QUERY)

  if (error) return <FullPageError />

  if (loading || !data) return <FullContentLoader />

  const onGoingIntent = data?.ongoingDepositIntent ?? null

  return (
    <CreateDepositForm
      onGoingIntent={onGoingIntent}
      onCompletedCallback={() => {}}
    />
  )
}
