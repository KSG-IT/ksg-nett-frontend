import { useQuery } from '@apollo/client'
import { Group, Stack, TextInput, Title } from '@mantine/core'
import { IconSearch } from '@tabler/icons'
import { Breadcrumbs } from 'components/Breadcrumbs'
import { FullPageError } from 'components/FullPageComponents'
import { FullContentLoader } from 'components/Loading'
import { PermissionGate } from 'components/PermissionGate'
import { SynCButton } from 'components/SyncButton'
import { useDeferredValue, useState } from 'react'
import { PERMISSIONS } from 'util/permissions'
import { ApplicantsTable } from '../components/ApplicantsOverview'
import { AddApplicantsArea } from '../components/ApplicantsOverview/AddApplicantsArea'
import { CURRENT_APPLICANTS_QUERY } from '../queries'
import { CurrentApplicantsReturns } from '../types.graphql'

const breadcrumbsItems = [
  { label: 'Home', path: '/dashboard' },
  { label: 'Orvik', path: '/admissions' },
  { label: 'Søkere', path: '' },
]

export const ApplicantsOverview: React.FC = () => {
  const [filterQuery, setFilterQuery] = useState('')

  const { data, loading, error, refetch } = useQuery<CurrentApplicantsReturns>(
    CURRENT_APPLICANTS_QUERY,
    {
      pollInterval: 20_000,
      fetchPolicy: 'network-only',
    }
  )

  if (error) return <FullPageError />

  if (loading || !data) return <FullContentLoader />

  const { currentApplicants } = data

  console.log(filterQuery)

  return (
    <Stack>
      <Breadcrumbs items={breadcrumbsItems} />
      <Group position="apart">
        <Title>Søkeroversikt</Title>
        <SynCButton
          refetchCallback={() => refetch()}
          refetchLoading={loading}
        />
      </Group>
      <PermissionGate permissions={PERMISSIONS.admissions.add.applicant}>
        <AddApplicantsArea />
      </PermissionGate>
      <TextInput
        label="Søk"
        placeholder="Søk etter navn, epost eller telefonnummer"
        icon={<IconSearch />}
        onChange={e => setFilterQuery(e.currentTarget.value)}
      />
      <ApplicantsTable
        applicants={currentApplicants}
        filterQuery={filterQuery}
      />
    </Stack>
  )
}
