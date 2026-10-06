import { Button, Group, Stack, Text, Textarea } from '@mantine/core'
import { modals } from '@mantine/modals'
import { showNotification } from '@mantine/notifications'
import { useState } from 'react'
import { useUserMutations } from '../mutations.hooks'
import { MY_SETTINGS_QUERY, USER_QUERY } from '../queries'

interface EditAboutMeProps {
  aboutMe: string
}

// The user can rewrite "Om meg" one time. After the save, the backend sets
// canRewriteAboutMe to false and the settings page hides this section.
export const EditAboutMe: React.FC<EditAboutMeProps> = ({ aboutMe }) => {
  const [aboutMeData, setAboutMeData] = useState(aboutMe)
  const { updateAboutMe, updateAboutMeLoading } = useUserMutations()

  function handleUpdateAboutMe() {
    updateAboutMe({
      variables: {
        aboutMe: aboutMeData,
      },
      refetchQueries: [USER_QUERY, MY_SETTINGS_QUERY],
      onCompleted() {
        showNotification({
          title: 'Suksess',
          message: 'Beskrivelse oppdatert',
        })
      },
      onError({ message }) {
        showNotification({
          title: 'Feil',
          message,
        })
      },
    })
  }

  function handleConfirm() {
    modals.openConfirmModal({
      title: 'Lagre ny beskrivelse?',
      children: (
        <Text size="sm">
          Du kan bare endre beskrivelsen én gang. Etter dette kan du ikke endre
          den igjen.
        </Text>
      ),
      labels: { confirm: 'Lagre', cancel: 'Avbryt' },
      onConfirm: handleUpdateAboutMe,
    })
  }

  return (
    <Stack>
      <Textarea
        autosize
        minRows={4}
        value={aboutMeData}
        onChange={e => setAboutMeData(e.target.value)}
      />
      <Group justify="flex-end">
        <Button
          disabled={aboutMeData === aboutMe}
          loading={updateAboutMeLoading}
          onClick={handleConfirm}
        >
          Lagre
        </Button>
      </Group>
    </Stack>
  )
}
