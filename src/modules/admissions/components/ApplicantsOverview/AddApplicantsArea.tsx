import { Button, Group, Stack, Textarea } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { IconFileUpload, IconPlane } from '@tabler/icons-react'
import { MessageBox } from 'components/MessageBox'
import { useApplicantMutations } from 'modules/admissions/mutations.hooks'
import { CURRENT_APPLICANTS_QUERY } from 'modules/admissions/queries'
import { useState } from 'react'
import { UploadAdmissionCSVModal } from './UploadAdmissionCSVModal'

interface AddApplicantsAreaProps {
  onAdded?: () => void
}

export const AddApplicantsArea: React.FC<AddApplicantsAreaProps> = ({
  onAdded,
}) => {
  const [emails, setEmails] = useState('')
  const [open, setOpen] = useState(false)

  const { createApplicants, createApplicantsLoading } = useApplicantMutations()

  const handleCreateApplicants = () => {
    const parsedEmails = emails
      .split('\n')
      .filter(emailString => emailString !== '')
      .map(emailString => emailString.trim())

    createApplicants({
      variables: { emails: parsedEmails },
      refetchQueries: [CURRENT_APPLICANTS_QUERY],
      onCompleted() {
        showNotification({
          title: 'Suksess',
          message: 'Søkere lagt til',
        })
        setEmails('')
        onAdded?.()
      },
      onError({ message }) {
        showNotification({
          title: 'Noe gikk galt',
          message,
          color: 'red',
        })
      },
    })
  }
  return (
    <Stack>
      <MessageBox type="info">
        Her kan du legge inn søkere sin epost. Hver epost på hver sin linje.
      </MessageBox>
      <Textarea
        autosize
        minRows={8}
        maxRows={16}
        placeholder="søker1@epost.com&#10;søker2@epost.com&#10;..."
        value={emails}
        onChange={e => setEmails(e.target.value)}
      />
      <Group>
        <Button
          color="samfundet-red"
          leftSection={<IconPlane />}
          onClick={handleCreateApplicants}
          disabled={createApplicantsLoading}
        >
          Legg til søkere
        </Button>
        <Button
          color="samfundet-red"
          leftSection={<IconFileUpload />}
          onClick={() => setOpen(true)}
        >
          Last opp fil
        </Button>
        <UploadAdmissionCSVModal opened={open} onClose={() => setOpen(false)} />
      </Group>
    </Stack>
  )
}
