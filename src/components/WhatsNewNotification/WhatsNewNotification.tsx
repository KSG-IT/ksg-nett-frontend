import { Button, Divider, Group, Modal, Text, Title } from '@mantine/core'
import { useEffect, useRef, useState } from 'react'

// Using a hard-coded key value so its easy to force it to unhide.
// Increment this to force new message
const NOTIFICATION_KEY = '2026-10-6-1'

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
      <Text size="sm" c="gray" mt={0}>
        Siste oppdatering: 2026-10-06
      </Text>
      <Divider mb="md" />
      <Title order={4}>Nytt 6. oktober 2026</Title>
      <Text>
        <b>Vaktplanlegging (beta):</b> Roster og autofyll er åpnet for
        betatesting, og hjelper til med å planlegge vaktene. Vaktplanansvarlige
        setter opp rosteren, åpner en planleggingsperiode med frist og lar
        autofyll lage et utkast som kan justeres før det publiseres. Si fra via
        «Gi tilbakemelding» på kontrollpanelet, eller send en e-post til
        ksg-it@samfundet.no, om noe ikke fungerer eller bør bli bedre.
      </Text>
      <Text>
        <b>Min tilgjengelighet:</b> Er du på rosteren til en vaktplan, svarer du
        for hver vakt i perioden (vil gjerne, kan eller kan ikke), med et
        valgfritt notat. Svarene lagres av seg selv frem til fristen. Du får en
        melding når det er noe å svare på.
      </Text>
      <Text>
        <b>Utkast i vaktplanen:</b> Endringer i den nye vaktplanen lagres som
        utkast. De blir først synlige for medlemmene når en vaktplanansvarlig
        låser dem inn. Medlemmer med varsling på får én e-post med de nye
        vaktene.
      </Text>
      <Text>
        <b>Vakter:</b> Filtrer på gjeng og på dag, kveld eller natt, og se hvem
        som jobber samtidig som deg. Servering C, D og K heter nå Siri, Vollan
        og Skala.
      </Text>
      <Text>
        <b>Allergier:</b> Allergioversikten kan vise bare de som jobber i
        suppetiden (14–16).
      </Text>
      <Text>
        <b>Salgsstatistikk:</b> Viser omsetning uten bong, og totalt solgt med
        bong.
      </Text>
      <Text>
        <b>Mine innstillinger:</b> Nytt utseende, og allergiene velges i en
        liste med søk.
      </Text>
      <Text>En drikkelek har funnet veien inn på KSG-nett.</Text>
      <Divider mb="md" />
      <Title order={4}>Nytt tidligere i oktober 2026</Title>
      <Text>
        <b>Oppgradering:</b> KSG-nett har fått en større oppgradering, og mange
        sider har fått nytt utseende. Om noe ser rart ut eller ikke fungerer,
        trykk på «Gi tilbakemelding» på kontrollpanelet, eller send en e-post
        til ksg-it@samfundet.no.
      </Text>
      <Text>
        <b>Vakter:</b> Ny side som viser hvem som jobber en dag, som tidslinje
        på PC og som liste på mobil. Dine egne vakter er merket «Din vakt».
      </Text>
      <Text>
        <b>Mine vakter:</b> Neste vakt øverst, kommende og tidligere vakter på
        samme side, og en knapp for å legge vaktene inn i kalenderen din.
      </Text>
      <Text>
        <b>Vaktplaner:</b> Vaktplanansvarlige ser hvor langt fram hver vaktplan
        er satt opp, og hvor mange plasser som er ledige. Prøv det nye designet
        for vaktplanen («Nytt design!»): sett folk på vakt med noen få
        tastetrykk, se hvor mange vakter hver person har, og lag nye vakter rett
        i planen. Det fungerer også på mobil.
      </Text>
      <Text>
        <b>Kontrollpanelet:</b> Neste vakter, siste transaksjoner og sitatene
        har fått nytt utseende. Du kan sende tilbakemelding til KSG-IT rett fra
        kontrollpanelet, også anonymt.
      </Text>
      <Text>
        <b>Min økonomi:</b> Se hva du har brukt penger på per uke, måned eller
        semester. Kjøp vises med minus, og innskudd med pluss.
      </Text>
      <Text>
        <b>Salgsstatistikk:</b> Ny side for Soci-salg per produkt, fra dette
        semesteret til alle tider.
      </Text>
      <Text>
        <b>Vervhistorikk:</b> Vervhistorikken til en bruker kan nå rettes opp
        fra profilen, uten å gå via admin.
      </Text>
      <Text>
        <b>Søkere:</b> Søkeroversikten er mer kompakt, og kan sorteres og
        filtreres på status.
      </Text>
      <Text>
        <b>Allergier:</b> Vaktplanansvarlige ser allergiene til alle på jobb som
        en tabell for hele uka eller én dag.
      </Text>
      <Text>
        <b>Sidemenyen:</b> Nytt utseende, og siden du er på er alltid merket.
      </Text>
      <Text>
        <b>Ny versjon:</b> Når en ny versjon er ute, får du beskjed om å laste
        inn siden på nytt. Appen på mobilen henter nye versjoner raskere, og
        menyen er lukket når du åpner den.
      </Text>
      <Text>
        <b>Tider:</b> Vakter og intervjuer får riktige tider rundt midnatt og
        når sommertiden slutter. Understreking i tekstredigering fungerer nå.
      </Text>
      <Divider mb="md" />
      <Title order={4}>Fremhevede artikler</Title>
      <Text>
        Det er nå mulig å fremheve spesifikke artikler fra håndboken slik at de
        er tilgjengelige direkte fra sidemenyen.
      </Text>
      <Divider mb="md" />
      <Title order={4}>Arkivering av funksjonærbeskrivelser</Title>
      <Text>
        Det er nå mulig å arkivere gamle funksjonærbeskrivelser - Sendt inn av
        Karen 'KniseKaren Queen Bestemor' Johanne Øfstaas
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
      <Group justify="flex-end">
        <Button onClick={handleClose}>Lukk vindu</Button>
      </Group>
    </Modal>
  )
}
