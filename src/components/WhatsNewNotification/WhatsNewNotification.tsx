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
const NOTIFICATION_KEY = '2023-07-13:1'

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
          <Spoiler
            pb={10}
            maxHeight={100}
            showLabel={'Les mer'}
            hideLabel="Gjem tekst"
          >
            <Group>
              <ActionIcon onClick={handleClose}>
                <IconX />
              </ActionIcon>
            </Group>
            <Title my={0} order={4}>
              👋 Hva er nytt?
            </Title>
            <ul>
              <li>Opptaksforbedringer</li>
              <ul>
                <li>
                  Prioriteringer endres nå hos søkeren i stedet for
                  intervjunotater
                </li>
                <li>
                  Intervjumal konfigureres på forhånd og kopieres til all
                  intervjunotater
                </li>
                <li>
                  Lettere å endre tidspunkter det er mulig å booke intervju
                  under opptaksperioden
                </li>
                <li>Det er nå mulig å anbefale kandidater til andre gjenger</li>
                <li>
                  Sortere på prioritering eller intervjutid i tabellen for
                  fordelingsmøtet
                </li>
              </ul>
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
