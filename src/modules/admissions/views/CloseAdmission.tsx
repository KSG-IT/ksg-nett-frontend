import { useQuery } from '@apollo/client'
import { Button, Group, Paper, Stack, Title } from '@mantine/core'
import { IconFileAnalytics } from '@tabler/icons'
import { FullPageError } from 'components/FullPageComponents'
import { FullContentLoader } from 'components/Loading'
import { MessageBox } from 'components/MessageBox'
import { useState } from 'react'
import { API_URL } from 'util/env'
import {
  CloseAdmissionTable,
  FinalOverlookModal,
  FreeForAllWithOffersTable,
} from '../components/CloseAdmission'
import { VALID_APPLICANTS_QUERY } from '../queries'

export const CloseAdmission: React.FC = () => {
  const [previewModalOpen, setPreviewModalOpen] = useState(false)
  const { error, loading, data } = useQuery(VALID_APPLICANTS_QUERY)

  if (error) return <FullPageError />

  if (loading || !data) return <FullContentLoader />

  const {
    closeAdmissionData: { validApplicants, applicantInterests },
  } = data

  return (
    <Stack>
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
        søkere som har blitt markert som <b>Vil ha</b> eller <b>Reserve</b>{' '}
        etter det interne fordelignsmøtet av minst én av prioriteringen deres.
        Søkere vil bli tilegnet et verv automatisk avhengig av den gjengen med
        øverste prioritet som har sagt at de har lyst på kandidaten.
      </MessageBox>
      <CloseAdmissionTable applicants={validApplicants} />

      <Title order={2}> Kandidater med tilbud fra andre gjenger</Title>
      <MessageBox type="info">
        Her har du mulighet til å gi søkere til gjenger som har sagt at de haar
        lyst på kandidaten. En kandidat kan dukke opp flere ganger i denne
        tabellen, én gang for hver gjeng som har meldt interesse. Ved å trykke
        på knappen i tabellen gir du kandidaten til en av gjengene. Dette kan du
        endre på så mye du vil fram til opptaket stenges.
      </MessageBox>
      <FreeForAllWithOffersTable applicantInterests={applicantInterests} />
      <Group>
        <Button color="samfundet-red" onClick={() => setPreviewModalOpen(true)}>
          Fullfør opptak
        </Button>
        <a href={`${API_URL}/admissions/callsheet`} target="_blank">
          <Button leftIcon={<IconFileAnalytics />} color="samfundet-red">
            Last ned ringeliste
          </Button>
        </a>
      </Group>
      <FinalOverlookModal
        opened={previewModalOpen}
        onClose={() => setPreviewModalOpen(false)}
      />
    </Stack>
  )
}
