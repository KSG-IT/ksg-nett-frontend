import { useQuery } from '@apollo/client'
import { Button, Group, Stack, Title } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { FullPageError } from 'components/FullPageComponents'
import { FullContentLoader } from 'components/Loading'
import { PermissionGate } from 'components/PermissionGate'
import { Navigate, useNavigate } from 'react-router-dom'
import { PERMISSIONS } from 'util/permissions'
import { AdmissionsShortcutPanel } from '../components/AdmissionDashboard/AdmissionsShortcutPanel'
import { InternalGroupPreviewList } from '../components/DiscussionDashboard/InternalGroupPreviewList'
import { useAdmissionMutations } from '../mutations.hooks'
import {
  ACTIVE_ADMISSION_QUERY,
  ALL_INTERNAL_GROUP_APPLICANT_DATA,
} from '../queries'
import { AllInternalGroupsAcceptingApplicantsReturns } from '../types.graphql'

export const DiscussionDashboard: React.FC = () => {
  /**
   * This component should show show some overall progress statistics of the different groups
   * Should also list shortcuts to internal group dashboards
   * Shows a profile card of the applicant and their values
   * Can also show statistics for the group on the top
   *
   * TODO: Redirect if admission is in wrong state
   * if admissions.status !== IN_SESSION => redirect /admissions
   */
  const navigate = useNavigate()
  const { data, loading, error } =
    useQuery<AllInternalGroupsAcceptingApplicantsReturns>(
      ALL_INTERNAL_GROUP_APPLICANT_DATA
    )

  const { lockAdmission } = useAdmissionMutations()

  if (error) return <FullPageError />

  if (loading || !data) return <FullContentLoader />

  const handleLockAdmission = () => {
    lockAdmission({
      refetchQueries: [ACTIVE_ADMISSION_QUERY],
      onCompleted() {
        showNotification({
          title: 'Suksess',
          message: 'Fordelingsmøtet er låst',
        })
        navigate('/admissions')
      },
      onError({ message }) {
        showNotification({
          title: 'Noe gikk galt',
          message,
        })
      },
    })
  }
  const { allInternalGroupApplicantData } = data

  if (allInternalGroupApplicantData === null) {
    return <Navigate to="/admissions" />
  }
  return (
    <Stack>
      <Group position="apart" mb="md">
        <Title>Fordelingsmøtet</Title>
        <PermissionGate permissions={PERMISSIONS.admissions.change.admission}>
          <Button color="samfundet-red" onClick={handleLockAdmission}>
            Fordelingsmøtet er ferdig
          </Button>
        </PermissionGate>
      </Group>
      <AdmissionsShortcutPanel />
      <Title order={2}>Gjengene</Title>
      <InternalGroupPreviewList
        allInternalGroupApplicantData={allInternalGroupApplicantData}
      />
    </Stack>
  )
}
