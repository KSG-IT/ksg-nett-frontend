import { useQuery } from '@apollo/client'
import { Button, Group, Input, Stack, Title } from '@mantine/core'
import { IconFileAnalytics, IconSearch } from '@tabler/icons'
import { FullPageError } from 'components/FullPageComponents'
import { FullContentLoader } from 'components/Loading'
import { MessageBox } from 'components/MessageBox'
import { PermissionGate } from 'components/PermissionGate'
import { useState } from 'react'
import { API_URL } from 'util/env'
import { PERMISSIONS } from 'util/permissions'
import {
  CloseAdmissionTable,
  FinalOverlookModal,
  FreeForAllWithOffersTable,
} from '../components/CloseAdmission'
import { VALID_APPLICANTS_QUERY } from '../queries'

export const CloseAdmission: React.FC = () => {
  const [nameFilter, setNameFilter] = useState('')
  const [previewModalOpen, setPreviewModalOpen] = useState(false)
  const { error, loading, data } = useQuery(VALID_APPLICANTS_QUERY, {
    fetchPolicy: 'network-only',
  })

  if (error) return <FullPageError />

  if (loading || !data) return <FullContentLoader />

  const {
    closeAdmissionData: {
      validApplicants,
      applicantInterests,
      activeAdmission,
    },
  } = data

  if (activeAdmission === null || activeAdmission.status !== 'LOCKED') {
    return <span>Opptaket er enten ikke startet eller låst</span>
  }

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
      <Input
        value={nameFilter}
        placeholder="Søk på navn"
        icon={<IconSearch />}
        onChange={e => setNameFilter(e.currentTarget.value)}
      />
      <CloseAdmissionTable
        applicants={validApplicants}
        nameFilter={nameFilter}
      />

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
          Se over opptak
        </Button>
        <PermissionGate permissions={PERMISSIONS.admissions.change.admission}>
          <a href={`${API_URL}/admissions/callsheet`} target="_blank">
            <Button leftIcon={<IconFileAnalytics />} color="samfundet-red">
              Last ned ringeliste
            </Button>
          </a>
        </PermissionGate>
      </Group>
      <FinalOverlookModal
        opened={previewModalOpen}
        onClose={() => setPreviewModalOpen(false)}
      />
    </Stack>
  )
}
