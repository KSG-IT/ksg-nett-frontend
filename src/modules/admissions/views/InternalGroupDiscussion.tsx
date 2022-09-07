import { useQuery } from '@apollo/client'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Alert, Group, Paper, Stack, Text, Title } from '@mantine/core'
import { FullPageError } from 'components/FullPageComponents'
import { InfoPopover } from 'components/InfoPopover'
import { FullContentLoader } from 'components/Loading'
import { useParams } from 'react-router-dom'
import {
  DiscussApplicantsTable,
  FreeForAllApplicantsTable,
} from '../components/DiscussionDashboard'
import { INTERNAL_GROUP_DISCUSSION_DATA } from '../queries'
import { InternalGroupDiscussionDataReturns } from '../types.graphql'

interface InternalGroupDiscussionParams {
  internalGroupId: string
}

export const InternalGroupDiscussion: React.VFC = () => {
  const { internalGroupId } = useParams<InternalGroupDiscussionParams>()

  const { error, loading, data } = useQuery<InternalGroupDiscussionDataReturns>(
    INTERNAL_GROUP_DISCUSSION_DATA,
    {
      variables: { internalGroupId: internalGroupId },
      pollInterval: 1000 * 30, // polls every half minute
    }
  )

  if (error) return <FullPageError />

  if (loading || !data) return <FullContentLoader />

  const {
    internalGroupDiscussionData: {
      applicants,
      internalGroup,
      applicantsOpenForOtherPositions,
    },
  } = data

  return (
    <Stack style={{ overflowY: 'scroll', padding: '32px' }}>
      <Title>Fordelingsmøte {internalGroup.name}</Title>

      <Title order={2}>Kandidater tilgjengelige for vurdering</Title>
      <Alert
        style={{ overflow: 'visible' }}
        icon={<FontAwesomeIcon icon="info" />}
      >
        <Text>
          Søkere blir fortløpende oppdatert i denne tabellen. Her har du
          mulighet til å se hvordan de andre gjengene, og deres egen gjeng
          prioriterer kandidaten. På høyre side av tabellen finnes en meny som
          markerer hva deres gjeng vil gjøre med kandidaten. Bare søkere som er
          markert med <b>Vil ha</b> eller <b>Reserve</b> kommer videre med i
          systemet. Alle kandidater må bli vurdert før fordelingsmøtet kan
          stenges.
        </Text>
      </Alert>
      <Alert
        style={{ overflow: 'visible' }}
        icon={<FontAwesomeIcon icon="exclamation-triangle" />}
        color="yellow"
      >
        <Text weight="bold">
          Obs! Du markerer ønsker på vegne av {internalGroup.name}
        </Text>
      </Alert>
      <Paper p="md">
        <DiscussApplicantsTable
          internalGroup={internalGroup}
          applicants={applicants}
        />
      </Paper>

      <Group>
        {/* Backend query resolving that they are open for other positions and are not guaranteed a spot.
          Question remains, what are the conditions for this? All other priorities being DO_NOT_WANT? What about
          Reserve, pass-around etc.? Think we need to clearly define some type of condition.

          For now we can probably just render all applicants that are open for other positions, and filter
          away any that are guaranteed a spot
        */}
        {/* Move to own component */}
        <Title order={2}>Kandidater åpne for andre verv</Title>
        <InfoPopover
          content="Her har dere mulighet til å melde interesse for kandidater som er åpne
          for andre verv. Trykk på en kandidat for å se detaljene ved intervjuet. [TANKEN ER AT DETTE BLIR PITCHINGEN]"
        />
      </Group>
      <FreeForAllApplicantsTable
        applicants={applicantsOpenForOtherPositions}
        internalGroupId={internalGroupId}
      />
    </Stack>
  )
}
