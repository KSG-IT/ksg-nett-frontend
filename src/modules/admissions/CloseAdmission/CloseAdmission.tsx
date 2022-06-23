import { useQuery } from '@apollo/client'
import { Button, Group, Paper, Stack, Title } from '@mantine/core'
import { FullPageError } from 'components/FullPageComponents'
import { FullContentLoader } from 'components/Loading'
import { MessageBox } from 'components/MessageBox'
import { useState } from 'react'
import { API_URL } from 'util/env'
import { VALID_APPLICANTS_QUERY } from '../queries'
import { CloseAdmissionTable } from './CloseAdmissionTable'
import { FinalOverlookModal } from './FinalOverlookModal'
import { FreeForAllWithOffersTable } from './FreeForAllWithOffersTable'

/**
 * This component should be moved to its own route.
 * We protect the route behind some PermissionGate and then we
 * add a link/button which is hidden for anyone but admin to access
 * from the main dashboard.
 *
 * Can also do a redirect or something
 */
export const CloseAdmission: React.VFC = () => {
  const [previewModalOpen, setPreviewModalOpen] = useState(false)
  // Missing typing
  const { error, loading, data } = useQuery(VALID_APPLICANTS_QUERY)

  if (error) return <FullPageError />

  if (loading || !data) return <FullContentLoader />

  const {
    validApplicants: { validApplicants, applicantInterests },
  } = data

  return (
    <Stack style={{ overflowY: 'scroll' }} p="lg">
      {/* Here we can display the priorities and how each of the internal groups prioritizes/evaluates them? */}
      <Title mb="sm">Fullføring av opptak</Title>
      <MessageBox type="info">
        Dette er siste delen av opptaket. Her har du tilgang på to tabeller. Den
        første er for alle kandidater som eksplisitt har fått et tilbud av en av
        gjengene de har søkt på. Den andre tabellen er for søkere som åpne for
        andre verv og har fått et tilbud fra én eller flere gjenger. Du kan ha
        denne siden oppe på det eksterne fordelingsmøtet og markere fortløpende
        de kandidatene vi får.
      </MessageBox>
      <Title order={2}>Kandidater som har fått tilbud</Title>
      <MessageBox type="info">
        Her markerer du hvem som blir tatt opp i <b>KSG</b>. Dette er alle
        søkere som har blitt market som noe annet enn <b>Vil ikke ha</b>. Søkere
        vil bli tilegnet et verv automatisk avhengig av den gjengen med øverste
        prioritet som har sagt at de har lyst på kandidaten.
      </MessageBox>
      <Paper p="md" mt="sm">
        <CloseAdmissionTable applicants={validApplicants} />
      </Paper>

      <Title order={2}> Kandidater med tilbud fra andre gjenger</Title>
      <MessageBox type="info">
        Her har du mulighet til å gi søkere til gjenger som har sagt at de haar
        lyst på kandidaten. En kandidat kan dukke opp flere ganger i denne
        tabellen, én gang for hver gjeng som har meldt interesse. Ved å trykke
        på knappen i tabellen gir du kandidaten til en av gjengene. Dette kan du
        endre på så mye du vil fram til opptaket stenges.
      </MessageBox>
      <MessageBox type="warning">
        <b>Obs! </b> Mangler knapp for å angre på å gi bort en kandidat så ikke
        trykk på en kandidat som ikke skal få et tilbud (kommer snart
        <sup>
          <b>TM</b>
        </sup>
        ).
      </MessageBox>
      <Paper p="sm">
        <FreeForAllWithOffersTable applicantInterests={applicantInterests} />
      </Paper>
      <Group>
        <Button onClick={() => setPreviewModalOpen(true)}>
          Fullfør opptak
          {/* Add a modal to this which shows the end result */}
        </Button>
        <a href={`${API_URL}/admissions/callsheet`} target="_blank">
          <Button>Last ned ringeliste</Button>
        </a>
      </Group>
      <FinalOverlookModal
        opened={previewModalOpen}
        onClose={() => setPreviewModalOpen(false)}
      />
    </Stack>
  )
}
