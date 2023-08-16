import {
  ActionIcon,
  Affix,
  Button,
  Collapse,
  Divider,
  Group,
  Paper,
  Spoiler,
  Stack,
  Text,
  Title,
  createStyles,
} from '@mantine/core'
import { IconX, IconNews } from '@tabler/icons-react'
import { useEffect, useRef, useState } from 'react'

// Using a hard-coded key value so its easy to force it to unhide.
// Increment this to force new message
const NOTIFICATION_KEY = '2023-08-17:1'

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
      <Paper shadow="xl" className={classes.card}>
        <Stack spacing="xs">
          <Group ml={'xs'} mt={'sm'} position="left" spacing={'xl'}>
            <ActionIcon onClick={handleClose}>
              <IconX />
            </ActionIcon>
            <Title order={4}>
              <IconNews size={18} color="gray" /> Hva er nytt?
            </Title>
          </Group>
          <Divider />
          <Spoiler
            px={'sm'}
            pb={10}
            maxHeight={100}
            showLabel={
              <Button m={'xs'} size="xs" variant="subtle">
                Les mer
              </Button>
            }
            hideLabel={
              <Button m={'xs'} size="xs" variant="subtle">
                Skjul
              </Button>
            }
          >
            <ul>
              <li>Socisctics</li>
              <ul>
                <li>Ny modul, ligger under Økonomi</li>
                <li>Grensesnitt for å se omsetning over tid</li>
                <li>Oversikt over antall enheter</li>
              </ul>
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

const useStyles = createStyles(theme => ({
  wrapper: {
    width: 300,
    fontSize: 14,
    borderRadius: 10,
    boxShadow: '1px  black',
  },
  card: {
    border: `1px solid ${theme.colors['gray'][3]}`,
    borderTop: `4px solid ${theme.colors['samfundet-red'][6]}`,
  },
}))
