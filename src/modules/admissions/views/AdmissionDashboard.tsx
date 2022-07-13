import { useMutation, useQuery } from '@apollo/client'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button, Title } from '@mantine/core'
import { FullPageError } from 'components/FullPageComponents'
import { FullContentLoader } from 'components/Loading'
import { useState } from 'react'
import { toast } from 'react-hot-toast'
import { Redirect } from 'react-router-dom'
import styled from 'styled-components'
import { PatchMutationVariables } from 'types/graphql'
import { ConfigurationWizard } from '.'
import {
  InternalGroupsNav,
  MyUpcomingInterviews,
} from '../components/AdmissionDashboard'
import { AdmissionsShortcutPanel } from '../components/AdmissionDashboard/AdmissionsShortcutPanel'
import { AdmissionStatusValues } from '../consts'
import { CREATE_APPLICATIONS, PATCH_ADMISSION } from '../mutations'
import { ACTIVE_ADMISSION_QUERY } from '../queries'
import {
  ActiveAdmissioneturns,
  CreateApplicationsReturns,
  CreateApplicationsVariables,
  PatchAdmissionInput,
  PatchAdmissionReturns,
} from '../types.graphql'

const Wrapper = styled.div`
  ${props => props.theme.layout.default};
  overflow-y: scroll;
`

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

  const [createApplications] = useMutation<
    CreateApplicationsReturns,
    CreateApplicationsVariables
  >(CREATE_APPLICATIONS, { refetchQueries: ['ActiveAdmission'] })

  if (error) return <FullPageError />

  if (loading || !data) return <FullContentLoader />

  const handleCreateApplications = () => {
    const parsedEmails = emails
      .split('\n')
      .filter(emailString => emailString !== '')

    toast.promise(createApplications({ variables: { emails: parsedEmails } }), {
      loading: 'Oppretter søknader',
      error: 'Noe gikk galt',
      success: 'søknader opprettet',
    })
    setEmails('')
  }

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
    return <ConfigurationWizard />

  if (activeAdmission.status === 'IN_SESSION') {
    return <Redirect to="/admissions/discussion-dashboard" />
  }

  if (activeAdmission.status === 'LOCKED') {
    return <Redirect to="/admissions/close" />
  }

  return (
    <Wrapper>
      <Title>Kontrollpanel opptak</Title>
      <AdmissionsShortcutPanel />
      {/* <ApplicantStatistics admission={activeAdmission} /> */}
      <InternalGroupsNav />
      <MyUpcomingInterviews />

      <Button
        leftIcon={<FontAwesomeIcon icon="clock" />}
        disabled={nextPhaseLoading}
        onClick={() => {
          handleAdmissionNextPhase(activeAdmission.id)
        }}
      >
        Intervjuperioden er over
      </Button>
    </Wrapper>
  )
}
