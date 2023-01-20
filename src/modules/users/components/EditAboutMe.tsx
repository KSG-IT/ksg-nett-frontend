import { Button, Stack, Textarea, Title } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { MessageBox } from 'components/MessageBox'
import { useState } from 'react'
import { useUserMutations } from '../mutations.hooks'
import { MY_SETTINGS_QUERY, USER_QUERY } from '../queries'

interface EditAboutMeProps {
  aboutMe: string
}

export const EditAboutMe: React.FC<EditAboutMeProps> = ({ aboutMe }) => {
  const [aboutMeData, setAboutMeData] = useState(aboutMe)
  const { updateAboutMe, updateAboutMeLoading } = useUserMutations()
  function handleUpdateAboutMe() {
    const confirmed = confirm(
      'Bekreft oppdatering. Dette har du bare mulighet til å gjøre én gang.'
    )
    if (!confirmed) return

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
  return (
    <Stack>
      <Title order={3}>Om meg</Title>
      <MessageBox type="info">
        Om du er veldig misfornøyd med hva du presterte med å skrive her får du
        mulighet til å endre den én gang.
      </MessageBox>
      <Textarea
        value={aboutMeData}
        onChange={e => setAboutMeData(e.target.value)}
      />
      <Button loading={updateAboutMeLoading} onClick={handleUpdateAboutMe}>
        Oppdater
      </Button>
    </Stack>
  )
}
