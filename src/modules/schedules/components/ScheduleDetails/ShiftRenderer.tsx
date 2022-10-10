import { useQuery } from '@apollo/client'
import { FullPageError } from 'components/FullPageComponents'
import { FullContentLoader } from 'components/Loading'
import { ScheduleDisplayModeValues } from 'modules/schedules/consts'
import { NORMALIZED_SHIFTS_FROM_RANGE_QUERY } from 'modules/schedules/queries'
import {
  ScheduleNode,
  ShiftDayWeek,
  ShiftLocationWeek,
} from 'modules/schedules/types.graphql'
import { format } from 'util/date-fns'
import { ShiftDayWeekList } from './ShiftDayWeekList'
import { ShiftLocationWeekList } from './ShiftLocationWeekList'

interface ShiftRendererProps {
  schedule: Pick<ScheduleNode, 'id' | 'displayMode'>
  shiftsFrom: Date
  numberOfWeeks: number
}

interface NormalizedShiftsFromRangeReturns {
  normalizedShiftsFromRange: ShiftDayWeek[] | ShiftLocationWeek[]
}

export const ShiftRenderer: React.FC<ShiftRendererProps> = ({
  schedule,
  shiftsFrom,
  numberOfWeeks,
}) => {
  const { id, displayMode } = schedule

  const { data, loading, error } = useQuery<NormalizedShiftsFromRangeReturns>(
    NORMALIZED_SHIFTS_FROM_RANGE_QUERY,
    {
      variables: {
        scheduleId: id,
        shiftsFrom: format(shiftsFrom, 'yyyy-MM-dd'),
        numberOfWeeks: numberOfWeeks,
      },
    }
  )

  if (error) return <FullPageError />

  if (loading || !data) return <FullContentLoader />

  return displayMode === ScheduleDisplayModeValues.SINGLE_LOCATION ? (
    <ShiftDayWeekList
      shiftDayWeeks={data.normalizedShiftsFromRange as ShiftDayWeek[]}
      scheduleId={id}
    />
  ) : (
    <ShiftLocationWeekList
      shiftLocationWeeks={data.normalizedShiftsFromRange as ShiftLocationWeek[]}
      scheduleId={id}
    />
  )
}
