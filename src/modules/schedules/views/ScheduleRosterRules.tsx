import { useQuery } from '@apollo/client'
import { Stack } from '@mantine/core'
import { FullPageError } from 'components/FullPageComponents'
import { FullContentLoader } from 'components/Loading'
import { MessageBox } from 'components/MessageBox'
import { ALL_INTERNAL_GROUP_POSITIONS } from 'modules/organization/queries'
import { AllInternalGroupPositionsReturns } from 'modules/organization/types'
import { useParams } from 'react-router-dom'
import { RosterRules, RosterSyncPanel } from '../components/RosterRules'
import { ManagersOnly, SchedulePageHeader } from '../components/ScheduleTabs'
import { SCHEDULE_ROSTER_RULES_QUERY } from '../queries'
import { positionOptions } from '../roster'
import {
  ScheduleIdVariables,
  ScheduleRosterRulesReturns,
} from '../types.graphql'

// Regler (/schedules/:id/rules): the rules of the roster sync, and the sync
const ScheduleRosterRules: React.FC = () => {
  const { id } = useParams() as { id: string }
  const { data, loading, error } = useQuery<
    ScheduleRosterRulesReturns,
    ScheduleIdVariables
  >(SCHEDULE_ROSTER_RULES_QUERY, { variables: { id } })
  const schedule = data?.schedule
  // A schedule without an internal group can use any position
  const { data: positionsData } = useQuery<AllInternalGroupPositionsReturns>(
    ALL_INTERNAL_GROUP_POSITIONS,
    { skip: !schedule?.canManage || schedule.internalGroup !== null }
  )

  if (error) return <FullPageError />
  if (!schedule) return loading ? <FullContentLoader /> : <FullPageError />

  if (!schedule.canManage) {
    return (
      <Stack gap="md">
        <SchedulePageHeader schedule={schedule} page="Regler" />
        <ManagersOnly />
      </Stack>
    )
  }

  const groupPositions =
    schedule.internalGroup?.positions.edges.map(edge => edge.node) ?? null
  const positions = positionOptions(
    groupPositions,
    positionsData?.allInternalGroupPositions ?? []
  )

  return (
    <Stack gap="md">
      <SchedulePageHeader schedule={schedule} page="Regler" />
      <MessageBox type="info">
        Reglene sier hvem som står på rosteren. En regel gjelder ett verv og én
        type medlemskap. Synken legger til, endrer og fjerner rader etter
        reglene. Rader som er endret manuelt, beholder verdiene sine.
      </MessageBox>
      <RosterSyncPanel scheduleId={schedule.id} />
      <RosterRules
        scheduleId={schedule.id}
        rules={schedule.rosterGroupings}
        positions={positions}
      />
    </Stack>
  )
}

export default ScheduleRosterRules
