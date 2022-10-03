import { useQuery } from '@apollo/client'
import { FullPageError } from 'components/FullPageComponents'
import { FullContentLoader } from 'components/Loading'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { format } from 'util/date-fns'
import { SCHEDULE_QUERY } from '../queries'
import { ShiftNode } from '../types.graphql'

interface ScheduleDetailsParams {
  id: string
}

export const ScheduleDetails: React.FC = () => {
  const { id } = useParams<
    keyof ScheduleDetailsParams
  >() as ScheduleDetailsParams

  const [shiftsFrom, setShiftsFrom] = useState<Date>(new Date())
  const NUMBER_OF_WEEKS = 2

  const { data, loading, error } = useQuery(SCHEDULE_QUERY, {
    variables: {
      id,
      shiftsFrom: format(shiftsFrom, 'yyyy-MM-dd'),
      numberOfWeeks: NUMBER_OF_WEEKS,
    },
  })

  if (error) {
    return <FullPageError />
  }

  if (loading || !data) {
    return <FullContentLoader />
  }

  const { schedule } = data
  const { shiftsFromRange: shifts } = schedule

  return (
    <div>
      <h1>Schedule Details: {id}</h1>

      {shifts.map((shift: ShiftNode) => (
        <div key={shift.id}>
          <h2>{shift.datetimeStart}</h2>
          <p>{shift.location}</p>
        </div>
      ))}
    </div>
  )
}
