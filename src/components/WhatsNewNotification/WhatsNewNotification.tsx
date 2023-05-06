import {
  ActionIcon,
  Affix,
  Collapse,
  Group,
  Paper,
  Spoiler,
  Stack,
  Text,
  Title,
  createStyles,
} from '@mantine/core'
import { IconX } from '@tabler/icons'
import { useEffect, useRef, useState } from 'react'

// Using a hard-coded key value so its easy to force it to unhide.
// Increment this to force new message
const NOTIFICATION_KEY = '1'

export const WhatsNewNotification: React.FC = () => {
  const firstRender = useRef(true)
  const [hide, setHide] = useState(false)
  const { classes } = useStyles()

  useEffect(() => {
    if (!firstRender.current) return

    const hasClosedBefore = localStorage.getItem(NOTIFICATION_KEY)

    if (hasClosedBefore) {
      setHide(true)
    }
  }, [setHide])

  if (hide) return null

  function handleClose() {
    localStorage.setItem(NOTIFICATION_KEY, 'true')
    setHide(true)
  }

  return (
    <Affix className={classes.wrapper}>
      <Paper p="m">
        <Stack spacing="xs">
          <Spoiler maxHeight={100} showLabel={'Les mer'} hideLabel="Gjem tekst">
            <Group>
              <ActionIcon onClick={handleClose}>
                <IconX />
              </ActionIcon>
            </Group>
            <Title my={0} order={4}>
              👋 Hva er nytt?
            </Title>
            <ul>
              <li>Legge til 'Hva er nytt'</li>
              <li>
                Mulig å slette egne ikke-godkjente innskudd på 'Min økonomi'
              </li>
              <li>
                Mulighet for å sette minimum gjenværernde saldo for kjøp på
                krysseliste
              </li>
              <li>
                Forbedre tabell designet, mer kompakt og fargemarkering på
                listetyper
              </li>
            </ul>
          </Spoiler>
        </Stack>
      </Paper>
    </Affix>
  )
}

const useStyles = createStyles(() => ({
  wrapper: {
    width: 300,
    fontSize: 14,
    borderRadius: 10,
    boxShadow: '1px  black',
  },
}))
