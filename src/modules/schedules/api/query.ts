import { gql, QueryHookOptions, useQuery } from '@apollo/client'

const ALL_SCHEDULE_QUERY = gql`
  query GetSchedules {
    allSchedules {
      id
      name
    }
  }
`

export type Schedule = {
  id: string
  name: string
}

interface ScheduleQueryResult {
  allSchedules: Schedule[]
}

export const useScheduleQuery = (
  config: QueryHookOptions<ScheduleQueryResult> = {}
) => useQuery<ScheduleQueryResult>(ALL_SCHEDULE_QUERY, config)
