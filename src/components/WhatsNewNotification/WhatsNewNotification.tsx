import { Button, Divider, Group, Modal, Text, Title } from '@mantine/core'
import { useEffect, useRef, useState } from 'react'

// Using a hard-coded key value so its easy to force it to unhide.
// Increment this to force new message
const NOTIFICATION_KEY = '2023-09-12'

export const WhatsNewNotification: React.FC = () => {
  const firstRender = useRef(true)
  const [hide, setHide] = useState(true)

  useEffect(() => {
    if (!firstRender.current) return

    const hasClosedBefore = localStorage.getItem(NOTIFICATION_KEY)

    if (!hasClosedBefore) {
      setHide(false)
    }
  }, [setHide])

  if (hide) return null

  function handleClose() {
    localStorage.setItem(NOTIFICATION_KEY, 'true')
    setHide(true)
  }

  return (
    <Modal opened onClose={handleClose} size={'xl'}>
      <Title my={0} order={1}>
        👋 Hva er nytt?
      </Title>
      <Text size="sm" color="gray" mt={0}>
        Siste oppdatering: 2023-09-12
      </Text>
      <Divider mb="md" />
      <Title order={4}>Opprydning - 12. September 2023</Title>
      <Text>
        Fjernet blesting av KSG-IT opptak og midlertidige forum-modul. Lagt til
        automatisk stenging av gammel stilletime om ingen kjøp har blit gjort de
        siste 6 timene. Forbedre 'Hva er nytt' melding.
      </Text>
      <Divider my="md" />
      <Title order={4}>Opptaksforbedringer - 3. August 2023</Title>
      <ul>
        <li>Opptaksforbedringer</li>
        <ul>
          <li>
            Prioriteringer endres nå hos søkeren i stedet for intervjunotater
          </li>
          <li>
            Intervjumal konfigureres på forhånd og kopieres til all
            intervjunotater
          </li>
          <li>
            Lettere å endre tidspunkter det er mulig å booke intervju under
            opptaksperioden
          </li>
          <li>Det er nå mulig å anbefale kandidater til andre gjenger</li>
          <li>
            Sortere på prioritering eller intervjutid i tabellen for
            fordelingsmøtet
          </li>
        </ul>
      </ul>
      <Group position="right">
        <Button onClick={handleClose}>Lukk vindu</Button>
      </Group>
    </Modal>
  )
}
