import { useMutation, useQuery } from '@apollo/client'
import { Button, Group, Stack, Title } from '@mantine/core'
import { FullPageError } from 'components/FullPageComponents'
import { FullContentLoader } from 'components/Loading'
import { useHistory } from 'react-router-dom'
import { LOCK_ADMISSION_MUTATION } from '../AdmissionDashboard/mutations'
import { AdmissionsShortcutPanel } from '../AdmissionsShortcutPanel'
import { AllInternalGroupsAcceptingApplicantsReturns } from '../types'
import { InternalGroupPreviewList } from './InternalGroupPreviewList'
import { ALL_INTERNAL_GROUP_APPLICANT_DATA } from './queries'

export const DiscussionDashboard: React.VFC = () => {
  /**
   * This component should show show some overall progress statistics of the different groups
   * Should also list shortcuts to internal group dashboards
   * Shows a profile card of the applicant and their values
   * Can also show statistics for the group on the top
   *
   */
  const history = useHistory()
  const { data, loading, error } =
    useQuery<AllInternalGroupsAcceptingApplicantsReturns>(
      ALL_INTERNAL_GROUP_APPLICANT_DATA
    )

  const [lockAdmission] = useMutation(LOCK_ADMISSION_MUTATION, {
    refetchQueries: ['ActiveAdmission'],
  })

  if (error) return <FullPageError />

  if (loading || !data) return <FullContentLoader />

  const { allInternalGroupApplicantData } = data
  return (
    <Stack style={{ overflowY: 'scroll', width: '900px' }} p="lg">
      <AdmissionsShortcutPanel />
      <Group position="apart" mb="md">
        <Title>Fordelingsmøtet</Title>
        <Button onClick={() => lockAdmission()}>
          Fordelingsmøtet er ferdig
        </Button>
      </Group>
      <InternalGroupPreviewList
        allInternalGroupApplicantData={allInternalGroupApplicantData}
      />
    </Stack>
  )
}
