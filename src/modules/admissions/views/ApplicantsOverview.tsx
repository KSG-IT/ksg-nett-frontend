import { useQuery } from '@apollo/client'
import {
  Button,
  Group,
  Modal,
  Select,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core'
import { IconPlus, IconSearch } from '@tabler/icons-react'
import { Breadcrumbs } from 'components/Breadcrumbs'
import { FullPageError } from 'components/FullPageComponents'
import { FullContentLoader } from 'components/Loading'
import { PermissionGate } from 'components/PermissionGate'
import { SynCButton } from 'components/SyncButton'
import { DensityToggle, useTableDensity } from 'components/Table'
import { useDeferredValue, useMemo, useState } from 'react'
import { PERMISSIONS } from 'util/permissions'
import { ApplicantsTable } from '../components/ApplicantsOverview'
import { AddApplicantsArea } from '../components/ApplicantsOverview/AddApplicantsArea'
import { ApplicantStatusValues } from '../consts'
import { parseApplicantStatus } from '../parsing'
import { CURRENT_APPLICANTS_QUERY } from '../queries'
import { CurrentApplicantsReturns } from '../types.graphql'

const breadcrumbsItems = [
  { label: 'Home', path: '/dashboard' },
  { label: 'Orvik', path: '/admissions' },
  { label: 'Søkere', path: '' },
]

const statusOptions = Object.values(ApplicantStatusValues).map(status => ({
  value: status,
  label: parseApplicantStatus(status) ?? status,
}))

export const ApplicantsOverview: React.FC = () => {
  const [filterQuery, setFilterQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string | null>(null)
  const [addModalOpen, setAddModalOpen] = useState(false)
  const deferredFilterQuery = useDeferredValue(filterQuery)
  const { density, setDensity, tableProps } = useTableDensity(
    'applicants-overview',
    'compact'
  )

  const { data, loading, error, refetch } = useQuery<CurrentApplicantsReturns>(
    CURRENT_APPLICANTS_QUERY,
    {
      pollInterval: 20_000,
      fetchPolicy: 'network-only',
    }
  )

  const applicants = useMemo(() => {
    const query = deferredFilterQuery.trim().toLowerCase()
    return (data?.currentApplicants ?? []).filter(
      applicant =>
        (!statusFilter || applicant.status === statusFilter) &&
        (!query ||
          applicant.fullName.toLowerCase().includes(query) ||
          applicant.email.toLowerCase().includes(query) ||
          applicant.phone.includes(query))
    )
  }, [data, deferredFilterQuery, statusFilter])

  if (error) return <FullPageError />

  if (loading || !data) return <FullContentLoader />

  const total = data.currentApplicants.length

  return (
    <Stack>
      <Breadcrumbs items={breadcrumbsItems} />
      <Group justify="space-between">
        <Title>Søkeroversikt</Title>
        <Group gap="xs">
          <PermissionGate permissions={PERMISSIONS.admissions.add.applicant}>
            <Button
              leftSection={<IconPlus size={16} />}
              onClick={() => setAddModalOpen(true)}
            >
              Legg til søkere
            </Button>
          </PermissionGate>
          <SynCButton
            refetchCallback={() => refetch()}
            refetchLoading={loading}
          />
        </Group>
      </Group>
      <Modal
        opened={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        title="Legg til søkere"
        size="lg"
      >
        <AddApplicantsArea onAdded={() => setAddModalOpen(false)} />
      </Modal>

      <Group justify="space-between" wrap="wrap">
        <Group gap="xs" wrap="nowrap">
          <TextInput
            placeholder="Søk etter navn, epost eller telefonnummer"
            leftSection={<IconSearch size={16} />}
            value={filterQuery}
            onChange={e => setFilterQuery(e.currentTarget.value)}
            w={320}
          />
          <Select
            placeholder="Alle statuser"
            clearable
            data={statusOptions}
            value={statusFilter}
            onChange={setStatusFilter}
            w={200}
          />
        </Group>
        <Group gap="xs" wrap="nowrap">
          <Text fz="sm" c="dimmed">
            {applicants.length === total
              ? `${total} søkere`
              : `Viser ${applicants.length} av ${total}`}
          </Text>
          <DensityToggle density={density} onChange={setDensity} />
        </Group>
      </Group>

      <ApplicantsTable
        applicants={applicants}
        density={density}
        tableProps={tableProps}
      />
    </Stack>
  )
}
