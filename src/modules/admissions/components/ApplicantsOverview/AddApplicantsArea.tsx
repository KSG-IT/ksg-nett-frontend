import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button, Group, Stack, Textarea, Title } from '@mantine/core'
import { MessageBox } from 'components/MessageBox'
import { useApplicantMutations } from 'modules/admissions/mutations.hooks'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { UploadAdmissionCSVModal } from './UploadAdmissionCSVModal'

export const AddApplicantsArea: React.FC = () => {
  const [emails, setEmails] = useState('')
  const [open, setOpen] = useState(false)

  const { createApplicants, createApplicantsLoading } = useApplicantMutations()

  const handleCreateApplicants = () => {
    const parsedEmails = emails
      .split('\n')
      .filter(emailString => emailString !== '')
      .map(emailString => emailString.trim())

    toast.promise(createApplicants({ variables: { emails: parsedEmails } }), {
      loading: 'Oppretter søknader',
      error: 'Noe gikk galt',
      success: 'søknader opprettet',
    })
    setEmails('')
  }
  return (
    <Stack>
      <Title mt="md" order={2}>
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
      <Group>
        <Button
          leftIcon={<FontAwesomeIcon icon="paper-plane" />}
          onClick={handleCreateApplicants}
          disabled={createApplicantsLoading}
        >
          Legg til søkere
        </Button>
        <Button
          leftIcon={<FontAwesomeIcon icon="file-upload" />}
          onClick={() => setOpen(true)}
        >
          Last opp fil
        </Button>
        <UploadAdmissionCSVModal opened={open} onClose={() => setOpen(false)} />
      </Group>
    </Stack>
  )
}