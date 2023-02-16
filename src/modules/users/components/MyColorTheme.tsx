import { Button, Checkbox, Group, Select, Stack } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { useState } from 'react'
import { useUserMutations } from '../mutations.hooks'
import { UserNode } from '../types'
import { MY_SETTINGS_QUERY } from '../queries'

export interface MyColorThemeProps {
  user: Pick<UserNode, 'selectedTheme' | 'themes'>
}

export const MyColorTheme: React.FC<MyColorThemeProps> = ({ user }) => {
  const { updateMyTheme, updateMyThemeLoading } = useUserMutations()

  const [theme, setTheme] = useState<string | null>(
    user.selectedTheme ? user.selectedTheme.id : null
  )
  const themeOptions = user.themes.map(theme => ({
    label: theme.label,
    value: theme.id,
  }))

  function handleSave() {
    if (!theme) return
    updateMyTheme({
      variables: {
        themeId: theme,
      },
      refetchQueries: [MY_SETTINGS_QUERY],
      onCompleted() {
        showNotification({
          title: 'Suksess',
          message: 'Tema oppdatert',
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

  return (
    <Group>
      <Stack>
        <Select data={themeOptions} value={theme} onChange={setTheme} />

        <Button onClick={() => handleSave()}>Lagre tema</Button>
      </Stack>
    </Group>
  )
}
