import { FullPageError } from 'components/FullPageComponents'
import { FullContentLoader } from 'components/Loading'
import { useParams } from 'react-router-dom'

interface ScheduleDetailsParams {
  id: string
}

export const ScheduleDetails: React.FC = () => {
  const { id } = useParams<
    keyof ScheduleDetailsParams
  >() as ScheduleDetailsParams

  const error = false
  const loading = false
  const data = undefined

  if (error) {
    return <FullPageError />
  }

  if (loading || !data) {
    return <FullContentLoader />
  }

  return (
    <div>
      <h1>Schedule Details: {id}</h1>
    </div>
  )
}
