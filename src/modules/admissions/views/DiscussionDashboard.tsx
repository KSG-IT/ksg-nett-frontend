import { useQuery } from '@apollo/client'
import { Button, Group, Stack, Title } from '@mantine/core'
import { FullPageError } from 'components/FullPageComponents'
import { FullContentLoader } from 'components/Loading'
import { PermissionGate } from 'components/PermissionGate'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { PERMISSIONS } from 'util/permissions'
import { AdmissionsShortcutPanel } from '../components/AdmissionDashboard/AdmissionsShortcutPanel'
import { InternalGroupPreviewList } from '../components/DiscussionDashboard/InternalGroupPreviewList'
import { useAdmissionMutations } from '../mutations.hooks'
import { ALL_INTERNAL_GROUP_APPLICANT_DATA } from '../queries'
import { AllInternalGroupsAcceptingApplicantsReturns } from '../types.graphql'

export const DiscussionDashboard: React.VFC = () => {
  /**
   * This component should show show some overall progress statistics of the different groups
   * Should also list shortcuts to internal group dashboards
   * Shows a profile card of the applicant and their values
   * Can also show statistics for the group on the top
   *
   * TODO: Redirect if admission is in wrong state
   * if admissions.status !== IN_SESSION => redirect /admissions
   */
  const history = useNavigate()
  const { data, loading, error } =
    useQuery<AllInternalGroupsAcceptingApplicantsReturns>(
      ALL_INTERNAL_GROUP_APPLICANT_DATA
    )

  const { lockAdmission } = useAdmissionMutations()

  if (error) return <FullPageError />

  if (loading || !data) return <FullContentLoader />

  const handleLockAdmission = () => {
    lockAdmission({ refetchQueries: ['ActiveAdmission'] })
      .then(() => {
        toast.success('Fordelingsmøtet er låst')
        navigate('/admissions')
      })
      .catch(() => {
        toast.error('Noe gikk galt')
      })
  }
  const { allInternalGroupApplicantData } = data
  return (
    <Stack style={{ overflowY: 'scroll', width: '900px' }} p="lg">
      <AdmissionsShortcutPanel />
      <Group position="apart" mb="md">
        <Title>Fordelingsmøtet</Title>
        <PermissionGate permissions={PERMISSIONS.admissions.change.admission}>
          <Button onClick={handleLockAdmission}>
            Fordelingsmøtet er ferdig
          </Button>
        </PermissionGate>
      </Group>
      <InternalGroupPreviewList
        allInternalGroupApplicantData={allInternalGroupApplicantData}
      />
    </Stack>
  )
}
