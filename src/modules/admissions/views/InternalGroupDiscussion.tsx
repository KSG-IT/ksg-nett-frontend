import { useQuery } from '@apollo/client'
import { Group, Radio, Stack, Text, Title } from '@mantine/core'
import { Breadcrumbs } from 'components/Breadcrumbs'
import { FullPageError } from 'components/FullPageComponents'
import { FullContentLoader } from 'components/Loading'
import { MessageBox } from 'components/MessageBox'
import { SynCButton } from 'components/SyncButton'
import { useState } from 'react'
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

export const InternalGroupDiscussion: React.FC = () => {
  const [orderingKey, setOrderingKey] = useState<
    'priorities' | 'interview_time'
  >('priorities')
  const { internalGroupId } = useParams<
    keyof InternalGroupDiscussionParams
  >() as InternalGroupDiscussionParams

  const { error, loading, data, refetch } =
    useQuery<InternalGroupDiscussionDataReturns>(
      INTERNAL_GROUP_DISCUSSION_DATA,
      {
        variables: { internalGroupId: internalGroupId, orderingKey },
        pollInterval: 20_000,
        fetchPolicy: 'network-only',
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

  const breadcrumbsItems = [
    { label: 'Hjem', path: '/dashboard' },
    { label: 'Orvik', path: '/admissions' },
    { label: `Diskusjon ${internalGroup.name}`, path: '' },
  ]

  return (
    <Stack>
      <Breadcrumbs items={breadcrumbsItems} />
      <Group position="apart">
        <Title>Fordelingsmøte {internalGroup.name}</Title>
        <SynCButton
          refetchCallback={() => refetch()}
          refetchLoading={loading}
        />
      </Group>
      <Title order={2}>Kandidater tilgjengelige for vurdering</Title>
      <MessageBox type="info">
        Søkere blir fortløpende oppdatert i denne tabellen. Her har du mulighet
        til å se hvordan de andre gjengene, og deres egen gjeng prioriterer
        kandidaten. På høyre side av tabellen finnes en meny som markerer hva
        deres gjeng vil gjøre med kandidaten. Bare søkere som er markert med{' '}
        <b>Vil ha</b> eller <b>Reserve</b> kommer videre med i systemet. Alle
        kandidater må bli vurdert før fordelingsmøtet kan stenges.
      </MessageBox>
      <MessageBox type="warning">
        <Text weight="bold">
          Obs! Du markerer ønsker på vegne av {internalGroup.name}
        </Text>
      </MessageBox>
      <Radio.Group
        label="Sorteringsmodus"
        value={orderingKey}
        onChange={val => setOrderingKey(val as 'priorities' | 'interview_time')}
      >
        <Radio label="Prioriteringer" value="priorities" />
        <Radio label="Intervjutidspunkt" value="interview_time" />
      </Radio.Group>
      <DiscussApplicantsTable
        internalGroup={internalGroup}
        applicants={applicants}
      />

      <Title order={2}>Kandidater åpne for andre verv</Title>
      <FreeForAllApplicantsTable
        applicants={applicantsOpenForOtherPositions}
        internalGroupId={internalGroupId}
      />
    </Stack>
  )
}
