import { useQuery } from '@apollo/client'
import { Group, Stack, Title } from '@mantine/core'
import { BackButton } from 'components/BackButton'
import { FullPageError } from 'components/FullPageComponents'
import { FullContentLoader } from 'components/Loading'
import { PermissionGate } from 'components/PermissionGate'
import { SynCButton } from 'components/SyncButton'
import { PERMISSIONS } from 'util/permissions'
import { ApplicantsTable } from '../components/ApplicantsOverview'
import { AddApplicantsArea } from '../components/ApplicantsOverview/AddApplicantsArea'
import { CURRENT_APPLICANTS_QUERY } from '../queries'
import { CurrentApplicantsReturns } from '../types.graphql'

export const ApplicantsOverview: React.FC<{}> = ({}) => {
  const { data, loading, error, refetch } = useQuery<CurrentApplicantsReturns>(
    CURRENT_APPLICANTS_QUERY,
    {
      pollInterval: 20000,
    }
  )

  if (error) return <FullPageError />

  if (loading || !data) return <FullContentLoader />

  const { currentApplicants } = data

  return (
    <Stack>
      <BackButton to="/admissions" />
      <Group position="apart">
        <Title>Søkeroversikt</Title>
        <SynCButton refetchCallback={refetch} refetchLoading={loading} />
      </Group>
      <PermissionGate permissions={PERMISSIONS.admissions.add.applicant}>
        <AddApplicantsArea />
      </PermissionGate>
      <ApplicantsTable applicants={currentApplicants} />
    </Stack>
  )
}
