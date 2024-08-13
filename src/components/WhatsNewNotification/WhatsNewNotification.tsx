import {
  Button,
  Divider,
  Group,
  Modal,
  Text,
  Title,
  createStyles,
} from '@mantine/core'
import { useEffect, useRef, useState } from 'react'

// Using a hard-coded key value so its easy to force it to unhide.
// Increment this to force new message
const NOTIFICATION_KEY = '2024-08-13'

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
        Siste oppdatering: 2024-08-13
      </Text>
      <Divider mb="md" />
      <Title order={4}>Oppdatering vaktlister</Title>
      <Text>
        Det er nå mulig å for vaktlisteansvarlige å se ukentlige oversikter over
        allergener per dag. Husk å registrere allergenene dine riktig, og
        oppdatere vaktbytter. Servering C, D og K har blit lagt til listen over
        tilgjengelige lokaler.
      </Text>
      <Divider mb="md" />
      <Title order={4}>Mer info vakt epost - 20. Mars 2024</Title>
      <Text>
        Lagt til mer info i automatisk utsendt e-post når man blir satt opp på
        vakt - Sendt inn av 'Peder "høye peder" Brandstorp Sanden', løst av
        Håkon 'that / guy' Telje.
      </Text>
      <Divider mb="md" />
      <Title order={4}>Børsen inntar societeten - 11. November 2023</Title>
      <Text>
        KSG-IT introduserer socibørsen. Ekslusivt for én kveld vil priser være
        historisk lave og øke med etterspøselen. Har du lyst til å kjøpe 10
        shots til en lav pris, og skru den opp kjempemasse for de etter deg? Da
        er dette kvelden for deg.
        <br />
        Det gledes
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

const useStyles = createStyles(() => ({
  wrapper: {
    width: 300,
    fontSize: 14,
    borderRadius: 10,
    boxShadow: '1px  black',
  },
}))
