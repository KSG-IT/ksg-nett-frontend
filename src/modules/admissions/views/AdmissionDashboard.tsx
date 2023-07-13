import { useMutation, useQuery } from '@apollo/client'
import { Button, Group, Stack, Switch, Title } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { IconClock } from '@tabler/icons'
import { Breadcrumbs } from 'components/Breadcrumbs'
import { FullPageError } from 'components/FullPageComponents'
import { FullContentLoader } from 'components/Loading'
import { PermissionGate } from 'components/PermissionGate'
import { useState } from 'react'
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
import {
  ACTIVE_ADMISSION_QUERY,
  ALL_INTERNAL_GROUP_APPLICANT_DATA,
} from '../queries'
import {
  ActiveAdmissioneturns,
  PatchAdmissionInput,
  PatchAdmissionReturns,
} from '../types.graphql'

const breadcrumbsItems = [
  { label: 'Hjem', path: '/dashboard' },
  { label: 'Orvik', path: '/admissions' },
]

export const AdmissionDashboard: React.FC = () => {
  const { data, loading, error } = useQuery<ActiveAdmissioneturns>(
    ACTIVE_ADMISSION_QUERY,
    {
      fetchPolicy: 'network-only',
    }
  )

  const [admissionNextPhase, { loading: nextPhaseLoading }] = useMutation<
    PatchAdmissionReturns,
    PatchMutationVariables<PatchAdmissionInput>
  >(PATCH_ADMISSION)

  if (error) return <FullPageError />

  if (loading || !data) return <FullContentLoader />

  const handleAdmissionNextPhase = (admissionId: string) => {
    admissionNextPhase({
      variables: {
        id: admissionId,
        input: { status: AdmissionStatusValues.IN_SESSION },
      },
      refetchQueries: [
        ALL_INTERNAL_GROUP_APPLICANT_DATA,
        ACTIVE_ADMISSION_QUERY,
      ],
      onCompleted() {
        showNotification({
          title: 'Suksess',
          message: 'Fordelingsmøtet er nå i gang',
        })
      },
      onError({ message }) {
        showNotification({
          title: 'Noe gikk galt',
          message,
        })
      },
    })
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
    <Stack>
      <Breadcrumbs items={breadcrumbsItems} />
      <Group position="apart">
        <Title>Kontrollpanel opptak</Title>
        <PermissionGate permissions={PERMISSIONS.admissions.change.admission}>
          <Group>
            <InterviewBookingSettingSwitches
              admissionId={activeAdmission.id}
              lateBatchEnabledInitial={
                activeAdmission.interviewBookingLateBatchEnabled
              }
              overrideEnabledInitial={
                activeAdmission.interviewBookingOverrideEnabled
              }
            />
            <Button
              leftIcon={<IconClock />}
              disabled={nextPhaseLoading}
              color="samfundet-red"
              onClick={() => {
                handleAdmissionNextPhase(activeAdmission.id)
              }}
            >
              Intervjuperioden er over
            </Button>
          </Group>
        </PermissionGate>
      </Group>
      <AdmissionsShortcutPanel />

      <InternalGroupsNav />
      <MyUpcomingInterviews />
    </Stack>
  )
}

const InterviewBookingSettingSwitches: React.FC<{
  admissionId: string
  lateBatchEnabledInitial: boolean
  overrideEnabledInitial: boolean
}> = ({ lateBatchEnabledInitial, overrideEnabledInitial, admissionId }) => {
  const [lateBatchEnabled, setLateBatchEnabled] = useState(
    lateBatchEnabledInitial
  )
  const [overrideEnabled, setOverrideEnabled] = useState(overrideEnabledInitial)

  // Needs to be a fucking hook now
  const [patchAdmission] = useMutation<
    PatchAdmissionReturns,
    PatchMutationVariables<PatchAdmissionInput>
  >(PATCH_ADMISSION, {
    onCompleted() {
      showNotification({
        title: 'Suksess',
        color: 'teal',
        message: 'Innstillinger for intervjubooking oppdatert',
      })
    },
    onError(err) {
      showNotification({
        title: 'Noe gikk galt',
        message: err.message,
      })
    },
  })

  function handleLateBatchEnabledChange(
    evt: React.ChangeEvent<HTMLInputElement>
  ) {
    setLateBatchEnabled(evt.target.checked)
    patchAdmission({
      variables: {
        id: admissionId,
        input: {
          interviewBookingLateBatchEnabled: evt.target.checked,
        },
      },
    })
  }

  function handleOverrideEnabledChange(
    evt: React.ChangeEvent<HTMLInputElement>
  ) {
    setOverrideEnabled(evt.target.checked)
    patchAdmission({
      variables: {
        id: admissionId,
        input: {
          interviewBookingOverrideEnabled: evt.target.checked,
        },
      },
    })
  }
  return (
    <Group>
      <Switch
        label="Sene intervjuer først"
        checked={lateBatchEnabled}
        onChange={handleLateBatchEnabledChange}
      />
      <Switch
        label="Booke på samme dag"
        checked={overrideEnabled}
        onChange={handleOverrideEnabledChange}
      />
    </Group>
  )
}
