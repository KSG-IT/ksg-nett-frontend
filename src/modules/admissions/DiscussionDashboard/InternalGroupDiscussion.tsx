import { useQuery } from '@apollo/client'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  Alert,
  Button,
  Group,
  Paper,
  Stack,
  Table,
  Text,
  Title,
} from '@mantine/core'
import { FullPageError } from 'components/FullPageComponents'
import { InfoPopover } from 'components/InfoPopover'
import { FullContentLoader } from 'components/Loading'
import { useParams } from 'react-router-dom'
import { DiscussApplicantsTable } from './DicussApplicantsTable'
import { FreeForAllApplicantsTable } from './FreeForAllApplicantsTable'
import { InternalGroupPositionPriorityBadge } from './InternalGroupPositionPriorityBadge'
import { INTERNAL_GROUP_DISCUSSION_DATA } from './queries'
import { InternalGroupDiscussionDataReturns } from './types'

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
      processedApplicants,
      internalGroup,
      applicantsOpenForOtherPositions,
    },
  } = data

  // Move to its own component
  const applicantsOpenForOtherPositionsRows =
    applicantsOpenForOtherPositions.map(applicant => (
      <tr key={applicant.id}>
        <td>{applicant.fullName}</td>
        <td>
          <Button>Interessert i kandidat</Button>
        </td>
        <td>
          <Button
            leftIcon={<FontAwesomeIcon icon="eye" />}
            onClick={() => alert('Denne burde sende deg videre, lol')}
          >
            Mer info
          </Button>
        </td>
      </tr>
    ))

  // Move to its own component
  const processedApplicantsRows = processedApplicants.map(priority => (
    <tr key={priority.id}>
      <td>{priority.applicant.fullName}</td>
      <td>
        <InternalGroupPositionPriorityBadge priority={priority} />
      </td>
    </tr>
  ))

  return (
    <Stack style={{ overflowY: 'scroll', padding: '32px' }}>
      <Title>Fordelingsmøte {internalGroup.name}</Title>
      <Title order={2}>Statistikk</Title>
      <Paper p="md">
        <Stack>
          <Text>Kommer en gang i fremtiden</Text>
        </Stack>
      </Paper>
      <Title order={2}>Kandidater tilgjengelige for vurdering</Title>
      <Alert
        style={{ overflow: 'visible' }}
        icon={<FontAwesomeIcon icon="info" />}
      >
        <Text>
          Søkere blir fortløpende oppdatert i denne tabellen. Her har du
          mulighet til å se hvordan de andre gjengene, og deres egen gjeng
          prioriterer kandidaten. Å markere en kandidat som <b>Vil ikke ha </b>
          er en permanent handling og fjerner kandidaten fra denne tabellen. På
          høyre side av tabellen finnes en meny som markerer hva deres gjeng vil
          gjøre med kandidaten.
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
        {/* Move to own component */}
        <Title order={2}>Ferdigvurderte søkere</Title>
        <InfoPopover content="Dette er søkere dere har vurdert som at dere vil ha eller vil ikke ha" />
        <pre>Kan hende vi blir kvitt denne?</pre>
      </Group>
      <Paper p="md">
        <Table>
          <thead>
            <td>Navn</td>
            <td>{internalGroup.name} vurderinger</td>
          </thead>
          <tbody>{processedApplicantsRows}</tbody>
        </Table>
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
