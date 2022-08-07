import { useQuery } from '@apollo/client'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button, ScrollArea, Stack, Textarea, Title } from '@mantine/core'
import { FullPageError } from 'components/FullPageComponents'
import { FullContentLoader } from 'components/Loading'
import { MessageBox } from 'components/MessageBox'
import { PermissionGate } from 'components/PermissionGate'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { ApplicantsTable } from '../components/ApplicantsOverview'
import { useApplicantMutations } from '../mutations.hooks'
import { CURRENT_APPLICANTS_QUERY } from '../queries'
import { CurrentApplicantsReturns } from '../types.graphql'

export const ApplicantsOverview: React.FC<{}> = ({}) => {
  const [emails, setEmails] = useState('')
  const { data, loading, error } = useQuery<CurrentApplicantsReturns>(
    CURRENT_APPLICANTS_QUERY,
    {
      pollInterval: 20000,
    }
  )

  const { createApplicants, createApplicantsLoading } = useApplicantMutations()

  const handleCreateApplicants = () => {
    const parsedEmails = emails
      .split('\n')
      .filter(emailString => emailString !== '')

    toast.promise(createApplicants({ variables: { emails: parsedEmails } }), {
      loading: 'Oppretter søknader',
      error: 'Noe gikk galt',
      success: 'søknader opprettet',
    })
    setEmails('')
  }

  if (error) return <FullPageError />

  if (loading || !data) return <FullContentLoader />

  const { currentApplicants } = data

  return (
    <ScrollArea p="md" style={{ width: '100%' }}>
      <Stack>
        <Title mb="lg">Søkeroversikt</Title>
        <PermissionGate permissions={['admissions.add_applicant']}>
          <Title mt="md" mb="md" order={2}>
            Legg til søkere
          </Title>
          <MessageBox type="info">
            Her kan du legge inn søkere sin epost. Hver epost på hver sin linje.
          </MessageBox>
          <Textarea
            minRows={12}
            placeholder="søker1@epost.com&#10;søker2@epost.com&#10;..."
            value={emails}
            onChange={e => setEmails(e.target.value)}
          />
          <Button
            style={{ marginTop: '1rem' }}
            leftIcon={<FontAwesomeIcon icon="paper-plane" />}
            onClick={handleCreateApplicants}
            disabled={createApplicantsLoading}
          >
            Legg til søkere
          </Button>
        </PermissionGate>
        <ApplicantsTable applicants={currentApplicants} />
      </Stack>
    </ScrollArea>
  )
}
