import { Button, Card, Stack, Text, Title } from '@mantine/core'
import { Link } from '@mantine/tiptap'
import { useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Breadcrumbs } from 'components/Breadcrumbs'
import { RichTextEditor } from 'components/RichTextEditor'
import { formatDistanceToNow } from 'util/date-fns'

const ForumThread: React.FC = () => {
  const editor = useEditor({
    extensions: [StarterKit, Link],
  })
  return (
    <Stack spacing="xs">
      <Breadcrumbs
        items={[
          { label: 'Hjem', path: '/dashboard' },
          { label: 'Forum', path: '/forum' },
          { label: 'KSG-IT har opptak!', path: '' },
        ]}
      />
      <Title>KSG-IT har opptak!</Title>
      <Text style={{ fontSize: 12 }}>
        Av <b>Alexander Orvik</b>, {formatDistanceToNow(new Date())}
      </Text>

      <Card>
        <p>Hei!</p>
        <p>
          <b>tldr</b>: Vil du være grunnlegger av en ny gjeng? Er du glad i
          webutvikling og IT, eller har du lyst til å bli det? KSG-IT søker
          funksjonærer som vil være med på å foreviggjøre KSG sin IT-kompetanse.
          Dette blir et mindre tradisjonelt opptak etter KSG sine standarder og
          kommer ikke til å ha en veldig hard søknadsfrist eller typisk
          intervjuprosess. Vi vil helst at gjengen skal være på plass innen
          slutten av august, og kommer dermed til å stenge så snart aktuelle
          personer har blitt tatt opp.
        </p>
        <p>
          Om du er interessert er det bare å sende en e-post til
          <b> ksg-it-aktiv@samfundet.no</b> med kontaktinformasjonen din, så tar
          vi kontakt for en uformell samtale.
        </p>

        <p>
          <b>Not too long; did actually read: </b>
          Mot slutten av forrige semester fikk KSG innvilget funksjonæroblater
          for å begynne arbeidet med å stifte KSG-IT som en permanent gjeng, i
          stedet for en interessegruppe slik det har vært fram til nå. Etter mye
          arbeid de siste årene har man endelig kommet i mål med den nye
          versjonen av vårt internsystem, nemlig KSG-nett. Problemet nå er at
          prosjektet er for komplekst til at det er mulig å garantere at
          kompetansen for å drifte det videre ikke forsvinner over tid.
          Interessegrupper er en dugnad av natur, og å kreve tilnærmet 20 timer
          arbeid hver uke ved siden av ordinære plikter har ikke vist seg å være
          bærekraftig.
        </p>
        <p>
          Vi leter etter engasjerte KSG'ere som har interesse for, eller har
          lyst til å jobbe med webutvikling på høyt nivå. KSG-nett har allerede
          gjort store fremskritt i å forenkle hverdagen til de frivillige i KSG,
          men det er fortsatt masse igjen å ta av. Vervet er et funksjonærverv
          uten spesifikk bindingstid, men vi håper at de som søker har lyst til
          å være med i minst 2 semestre. Det forventes en arbeidsmengde på ca.
          20 timer i uken (slik som alle andre funksjonærverv), hvor meste av
          tiden vil gå til arbeidskvelder, workshops, opplæring, møtevirksomhet
          og diverse annet som måtte dukke opp. De som blir tatt opp står veldig
          fritt til å utforme hvordan dette vil se ut, i og med at det er veldig
          lite eksisterende rutiner og prosedyrer.
        </p>
        <p>
          Det er absolutt ikke et krav å allerede være en veletablert utvikler,
          du vil bli lært opp i de språkene og teknologiene som er relevante
          (Django, GraphQL og React + Typescript). Organisasjonen vår ligger på{' '}
          <a
            href="https://github.com/KSG-IT"
            target="_blank"
            style={{
              color: 'var(--mantine-color-primary)',
              textDecoration: 'underline',
              cursor: 'pointer',
            }}
          >
            github
          </a>{' '}
          for de av dere som liker å snoke i første omgang.
        </p>
        <p>
          Har du en ny killer idé for KSG-nett? Vet du hvordan vi kan gjøre noe
          bedre? Lurer du på om vi faktisk godkjenner innskudd gjennom
          kortbetaling? Eller vil du bare være med på reisen? Uansett hvilke av
          disse spørsmålene som måtte treffe deg så håper jeg du tar kontakt.
          Selv om du bare er usikker og har lyst å høre litt mer om hva det kan
          innebære.
        </p>
      </Card>
      <RichTextEditor editor={editor} />
      <Button>Nytt innlegg</Button>
    </Stack>
  )
}

export default ForumThread
