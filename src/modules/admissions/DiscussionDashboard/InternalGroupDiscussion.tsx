import { useQuery } from '@apollo/client'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Alert, Badge, Paper, Stack, Table, Text, Title } from '@mantine/core'
import { FullPageError } from 'components/FullPageComponents'
import { FullContentLoader } from 'components/Loading'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'
import { DiscussApplicantsTable } from './DicussApplicantsTable'
import { INTERNAL_GROUP_DISCUSSION_DATA } from './queries'
import { InternalGroupDiscussionDataReturns } from './types'

const Wrapper = styled.div`
  ${props => props.theme.layout.default};
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  overflow-y: scroll;
  gap: 15px;
`

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
      availablePicks,
      processedApplicants,
      internalGroup,
    },
  } = data

  const processedApplicantsRows = processedApplicants.map(priority => (
    <tr key={priority.id}>
      <td>{priority.applicant.fullName}</td>
      <td>
        <Badge>{priority.internalGroupPriority}</Badge>
      </td>
    </tr>
  ))

  return (
    <Wrapper>
      <Title>Fordelingsmøte {internalGroup.name}</Title>
      <Title order={2}>Statistikk</Title>
      <Paper p="md">
        <Stack>
          <Text>Kommer en gang i fremtiden</Text>
        </Stack>
      </Paper>
      <Title order={2}>Kandidater tilgjengelige for vurdering</Title>
      <Paper p="md">
        <DiscussApplicantsTable
          internalGroupPositionPriorites={availablePicks}
          internalGroup={internalGroup}
        />
      </Paper>
      <Alert
        style={{ overflow: 'visible' }}
        icon={<FontAwesomeIcon icon="info" />}
      >
        <Text>
          Søkere blir fortløpende gjort tilgjengelig i denne tabellen så fort
          som andre gjenger blir ferdig med å vurdere søkerne sine. Å markere en
          kandidat som <b>Vil ha</b> eller <b>Vil ikke ha</b> er permanente
          endringer og flytter de til tabellen under. <b>Send på runde</b> vil
          gjøre det mulig for neste gjeng i rekka å vurdere den aktuelle søkeren
          uten at dere gir opp kandidaten enda
        </Text>
      </Alert>

      <Title order={2}>Ferdigvurderte søkere</Title>
      <Paper p="md">
        <Table>
          <thead>
            <td>Navn</td>
            <td>{internalGroup.name} vurderinger</td>
          </thead>
          <tbody>{processedApplicantsRows}</tbody>
        </Table>
      </Paper>
    </Wrapper>
  )
}
