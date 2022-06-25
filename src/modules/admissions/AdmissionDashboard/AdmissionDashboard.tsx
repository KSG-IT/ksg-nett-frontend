import { useMutation, useQuery } from '@apollo/client'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  Button,
  Group,
  Paper,
  Stack,
  Table,
  Textarea,
  Title,
} from '@mantine/core'
import { FullPageError } from 'components/FullPageComponents'
import { FullContentLoader } from 'components/Loading'
import { MessageBox } from 'components/MessageBox'
import { useState } from 'react'
import { toast } from 'react-hot-toast'
import { Redirect } from 'react-router-dom'
import styled from 'styled-components'
import { PatchMutationVariables } from 'types/graphql'
import { AdmissionsShortcutPanel } from '../AdmissionsShortcutPanel'
import { ConfigurationWizard } from '../ConfigureAdmission/ConfigurationWizard'
import { CREATE_APPLICATIONS, PATCH_ADMISSION } from '../mutations'
import { ACTIVE_ADMISSION_QUERY } from '../queries'
import {
  ActiveAdmissioneturns,
  CreateApplicationsReturns,
  CreateApplicationsVariables,
  PatchAdmissionInput,
  PatchAdmissionReturns,
} from '../types'
import { ActiveAdmissionTable } from './ActiveAdmissionTable'
import { ApplicantStatistics } from './ApplicantStatistics'
import { InternalGroupsNav } from './InternalGroupsNav'

const Wrapper = styled.div`
  ${props => props.theme.layout.default};
  overflow-y: scroll;
`

export const AdmissionDashboard: React.VFC = () => {
  // Should display information about ongoing admission
  // admins should be able to open up a new admission if it does not exist
  const [emails, setEmails] = useState('')

  const { data, loading, error } = useQuery<ActiveAdmissioneturns>(
    ACTIVE_ADMISSION_QUERY,
    {
      // should not poll unless the admission is open. Should hide this behind some state and component
      pollInterval: 1000 * 30,
    }
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
        variables: { id: admissionId, input: { status: 'IN_SESSION' } },
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
      <Title>Opptak</Title>
      <AdmissionsShortcutPanel />
      <ApplicantStatistics admission={activeAdmission} />
      <InternalGroupsNav />
      <Title order={2} mt="md">
        Mine kommende intervjuer
      </Title>
      <Paper p="md">
        <Table>
          <thead>
            <td>Tidspunkt</td>
            <td>Lokale</td>
            <td>Søker</td>
          </thead>
          <tbody>
            <td>Ikke</td>
            <td>Implementert</td>
            <td>Enda</td>
          </tbody>
        </Table>
      </Paper>
      <Stack mt="md">
        <Title order={2}>Søkere</Title>
        <ActiveAdmissionTable admission={activeAdmission} />
      </Stack>
      <Stack>
        <Title order={2}>Legg til søkere</Title>
        <MessageBox type="info">
          Her kan du legge inn søkere sin epost. Hver epost på hver sin linje.
        </MessageBox>
        {/* ToDo: Replace with dropzone? Drop -> opens modal with all emails? */}
        <Textarea
          minRows={12}
          placeholder="søker1@epost.com&#10;søker2@epost.com&#10;..."
          value={emails}
          onChange={evt => setEmails(evt.target.value)}
        />
        <Group>
          <Button
            leftIcon={<FontAwesomeIcon icon="paper-plane" />}
            onClick={handleCreateApplications}
          >
            Send epost
          </Button>
          <Button
            leftIcon={<FontAwesomeIcon icon="clock" />}
            disabled={nextPhaseLoading}
            onClick={() => {
              handleAdmissionNextPhase(activeAdmission.id)
            }}
          >
            Intervjuperioden er over
          </Button>
        </Group>
      </Stack>
    </Wrapper>
  )
}
