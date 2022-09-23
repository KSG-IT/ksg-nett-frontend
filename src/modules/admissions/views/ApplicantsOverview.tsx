import { useQuery } from '@apollo/client'
import { Stack, Title } from '@mantine/core'
import { FullPageError } from 'components/FullPageComponents'
import { FullContentLoader } from 'components/Loading'
import { PermissionGate } from 'components/PermissionGate'
import { PERMISSIONS } from 'util/permissions'
import { ApplicantsTable } from '../components/ApplicantsOverview'
import { AddApplicantsArea } from '../components/ApplicantsOverview/AddApplicantsArea'
import { CURRENT_APPLICANTS_QUERY } from '../queries'
import { CurrentApplicantsReturns } from '../types.graphql'

export const ApplicantsOverview: React.FC<{}> = ({}) => {
  const { data, loading, error } = useQuery<CurrentApplicantsReturns>(
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
      <Title>Søkeroversikt</Title>
      <PermissionGate permissions={PERMISSIONS.admissions.add.applicant}>
        <AddApplicantsArea />
      </PermissionGate>
      <ApplicantsTable applicants={currentApplicants} />
    </Stack>
  )
}
