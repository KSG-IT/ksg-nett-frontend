import { useMutation, useQuery } from '@apollo/client'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button, Group, Title } from '@mantine/core'
import { FullPageError } from 'components/FullPageComponents'
import { FullContentLoader } from 'components/Loading'
import { PermissionGate } from 'components/PermissionGate'
import { useState } from 'react'
import { toast } from 'react-hot-toast'
import { Navigate } from 'react-router-dom'
import { PatchMutationVariables } from 'types/graphql'
import { PERMISSIONS } from 'util/permissions'
import {
  InternalGroupsNav,
  MyUpcomingInterviews,
} from '../components/AdmissionDashboard'
import { AdmissionsShortcutPanel } from '../components/AdmissionDashboard/AdmissionsShortcutPanel'
import { AdmissionStatusValues } from '../consts'
import { PATCH_ADMISSION } from '../mutations'
import { ACTIVE_ADMISSION_QUERY } from '../queries'
import {
  ActiveAdmissioneturns,
  PatchAdmissionInput,
  PatchAdmissionReturns,
} from '../types.graphql'

export const AdmissionDashboard: React.VFC = () => {
  // Should display information about ongoing admission
  // admins should be able to open up a new admission if it does not exist
  const [emails, setEmails] = useState('')

  // Rename this to some admission dashboard query instead
  const { data, loading, error } = useQuery<ActiveAdmissioneturns>(
    ACTIVE_ADMISSION_QUERY
  )

  const [admissionNextPhase, { loading: nextPhaseLoading }] = useMutation<
    PatchAdmissionReturns,
    PatchMutationVariables<PatchAdmissionInput>
  >(PATCH_ADMISSION)

  if (error) return <FullPageError />

  if (loading || !data) return <FullContentLoader />

  const handleAdmissionNextPhase = (admissionId: string) => {
    toast.promise(
      admissionNextPhase({
        variables: {
          id: admissionId,
          input: { status: AdmissionStatusValues.IN_SESSION },
        },
        refetchQueries: ['ActiveAdmission'],
      }),
      {
        error: 'Noe gikk galt',
        loading: 'Avslutter intervjuperioden',
        success: 'Intervjuperiode stengt!',
      }
    )
  }

  const { activeAdmission } = data

  if (activeAdmission === null || activeAdmission.status === 'CONFIGURATION')
    return <Navigate to="/admissions/configure" />

  if (activeAdmission.status === 'IN_SESSION') {
    return <Navigate to="/admissions/discussion-dashboard" />
  }

  if (activeAdmission.status === 'LOCKED') {
    return <Navigate to="/admissions/close" />
  }

  return (
    <>
      <Group position="apart">
        <Title>Kontrollpanel opptak</Title>
        <PermissionGate permissions={PERMISSIONS.admissions.change.admission}>
          <Button
            leftIcon={<FontAwesomeIcon icon="clock" />}
            disabled={nextPhaseLoading}
            onClick={() => {
              handleAdmissionNextPhase(activeAdmission.id)
            }}
          >
            Intervjuperioden er over
          </Button>
        </PermissionGate>
      </Group>
      <AdmissionsShortcutPanel />
      <InternalGroupsNav />
      <MyUpcomingInterviews />
    </>
  )
}
