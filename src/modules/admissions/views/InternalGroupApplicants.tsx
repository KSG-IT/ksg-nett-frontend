import { useQuery } from '@apollo/client'
import { Button, Group, Paper, Stack, Title } from '@mantine/core'
import { IconCircleCheck, IconCircleX } from '@tabler/icons'
import { BackButton } from 'components/BackButton'
import { Breadcrumbs } from 'components/Breadcrumbs'
import { FullPageError } from 'components/FullPageComponents'
import { FullContentLoader } from 'components/Loading'
import { MessageBox } from 'components/MessageBox'
import { SynCButton } from 'components/SyncButton'
import { useParams } from 'react-router-dom'
import { ApplicantsTable } from '../components/InternalGroupApplicants/ApplicantsTable'
import { INTERNAL_GROUP_APPLICANTS_DATA } from '../queries'
import {
  InternalGroupApplicantsDataReturns,
  InternalGroupApplicantsDataVariables,
} from '../types.graphql'

interface InternalGroupApplicantsParams {
  internalGroupId: string
}

export const InternalGroupApplicants: React.FC = ({}) => {
  const { internalGroupId } = useParams<
    keyof InternalGroupApplicantsParams
  >() as InternalGroupApplicantsParams
  const { data, loading, error, refetch } = useQuery<
    InternalGroupApplicantsDataReturns,
    InternalGroupApplicantsDataVariables
  >(INTERNAL_GROUP_APPLICANTS_DATA, {
    variables: { internalGroup: internalGroupId },
  })

  /**Functionality
   * Should list all applicants, grouped in the following manner
   *  > First priority
   *  > Second prierity
   *  > THird priority
   *  > Should be ordered by interview time and not render those whose interview time is more than an hour ago
   *  > Should distinguish between who is missing an interviewer from the group and who is not
   *  > Should also display some compiled list of all applicants?
   *  > Can also show interview statistics for the group
   *  > The main dashboard can probably show highscore list
   */

  if (error) return <FullPageError />

  if (loading || !data) return <FullContentLoader />

  const { internalGroupApplicantsData } = data

  const {
    firstPriorities,
    secondPriorities,
    thirdPriorities,
    internalGroup: { name: internalGroupName },
  } = internalGroupApplicantsData

  const breadcrumbsItems = [
    { label: 'Home', path: '/dashboard' },
    { label: 'Orvik', path: '/admissions' },
    { label: `Søkeroversikt ${internalGroupName}`, path: '' },
  ]

  return (
    <Stack>
      <Breadcrumbs items={breadcrumbsItems} />
      <Group position="apart">
        <Title>Søkeroversikt {internalGroupName}</Title>
        <SynCButton
          refetchCallback={() => refetch()}
          refetchLoading={loading}
        />
      </Group>
      <MessageBox type="info">
        <IconCircleX color="red" /> indikerer ingen fra{' '}
        {internalGroupName.toLocaleLowerCase()} er på intervjuet.{' '}
        <IconCircleCheck color="green" /> indikerer at det minst er én fra{' '}
        {internalGroupName.toLocaleLowerCase()} på intervjuet.
      </MessageBox>
      <Title order={2}>Førstevalg</Title>
      <Paper>
        <ApplicantsTable applicants={firstPriorities} />
      </Paper>
      <Title order={2}>Andrevalg</Title>
      <Paper>
        <ApplicantsTable applicants={secondPriorities} />
      </Paper>
      <Title order={2}>Tredjevalg</Title>
      <Paper>
        <ApplicantsTable applicants={thirdPriorities} />
      </Paper>
    </Stack>
  )
}
