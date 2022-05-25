import { useMutation, useQuery } from '@apollo/client'
import { Button, Group, Stack, Textarea, Title } from '@mantine/core'
import { FullPageError } from 'components/FullPageComponents'
import { FullContentLoader } from 'components/Loading'
import { useState } from 'react'
import { toast } from 'react-hot-toast'
import styled from 'styled-components'
import { PatchMutationVariables } from 'types/graphql'
import { CloseAdmission } from '../CloseAdmission'
import { ConfigurationWizard } from '../ConfigureAdmission/ConfigurationWizard'
import { DiscussionDashboard } from '../DiscussionDashboard'
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
import { InternalGroupsNav } from './InternalGroupsNav'

const Wrapper = styled.div`
  ${props => props.theme.layout.default};
  overflow-y: scroll;
`

const AddApplicantArea = styled.textarea``

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

  const [admissionNextPhase] = useMutation<
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
    const parsedEmails = emails.split('\n')
    toast.promise(createApplications({ variables: { emails: parsedEmails } }), {
      loading: 'Oppretter søknader',
      error: 'Noe gikk galt',
      success: 'søknader opprettet',
    })
    setEmails('')
  }

  const handleAdmissionNextPhase = (admissionId: string) => {
    admissionNextPhase({
      variables: { id: admissionId, input: { status: 'IN_SESSION' } },
    })
  }

  const { activeAdmission } = data

  if (activeAdmission === null || activeAdmission.status === 'CONFIGURATION')
    return <ConfigurationWizard />

  if (activeAdmission.status === 'IN_SESSION') {
    return (
      <Wrapper>
        <DiscussionDashboard />
      </Wrapper>
    )
  }

  if (activeAdmission.status === 'LOCKED') {
    return (
      <Wrapper>
        <CloseAdmission />
      </Wrapper>
    )
  }

  return (
    <Wrapper>
      <Title>Opptak</Title>
      <InternalGroupsNav />
      <Stack>
        <Title order={2}>Søkere</Title>
        <ActiveAdmissionTable admission={activeAdmission} />
      </Stack>
      <Stack>
        <Title order={2}>Legg til søkere</Title>
        <Textarea
          minRows={12}
          placeholder="søker1@epost.com&#10;søker2@epost.com&#10;..."
          value={emails}
          onChange={evt => setEmails(evt.target.value)}
        />
        <Group>
          <Button onClick={handleCreateApplications}>Send epost</Button>
          <Button
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
