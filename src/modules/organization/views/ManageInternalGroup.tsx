import { useQuery } from '@apollo/client'
import {
  ActionIcon,
  Button,
  Drawer,
  Group,
  Modal,
  Popover,
  SegmentedControl,
  Select,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core'
import { IconInfoCircle, IconPlus, IconSearch } from '@tabler/icons-react'
import { Breadcrumbs } from 'components/Breadcrumbs'
import { FullPageError } from 'components/FullPageComponents'
import { FullContentLoader } from 'components/Loading'
import { MembershipHistoryEditor } from 'modules/organization/components/MembershipHistoryEditor'
import { UserManagementAddUser } from 'modules/organization/components/UserManagement'
import {
  ManageMembershipRecord,
  UserManagementTable,
} from 'modules/organization/components/UserManagement/UserManagementTable'
import { internalGroupPositionTypeOptions } from 'modules/organization/consts'
import {
  ManageUsersDataReturns,
  ManageUsersDataVariables,
} from 'modules/organization/types.graphql'
import { MANAGE_USERS_DATA_QUERY } from 'modules/users/queries'
import React, { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'

interface ManageInternalGroupParams {
  internalGroupId: string
}

type View = 'active' | 'earlier' | 'all'

export const ManageInternalGroup: React.FC = () => {
  const { internalGroupId } = useParams<
    keyof ManageInternalGroupParams
  >() as ManageInternalGroupParams
  const [modalOpen, setModalOpen] = useState(false)
  const [historyUserId, setHistoryUserId] = useState<string | null>(null)
  const [view, setView] = useState<View>('active')
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<string | null>(null)

  const { data, loading, error } = useQuery<
    ManageUsersDataReturns,
    ManageUsersDataVariables
  >(MANAGE_USERS_DATA_QUERY, {
    variables: {
      internalGroupId: internalGroupId,
    },
  })

  // allMemberships holds the memberships that have ended
  const { active, earlier } = useMemo(
    () => ({
      active: (data?.manageUsersData.activeMemberships ?? []).map(
        membership => ({ ...membership, active: true })
      ),
      earlier: (data?.manageUsersData.allMemberships ?? []).map(membership => ({
        ...membership,
        active: false,
      })),
    }),
    [data]
  )

  const records = useMemo(() => {
    const byView: Record<View, ManageMembershipRecord[]> = {
      active,
      earlier,
      all: [...active, ...earlier],
    }
    const query = search.trim().toLowerCase()
    return byView[view].filter(
      record =>
        (!query || record.fullName.toLowerCase().includes(query)) &&
        (!typeFilter || record.internalGroupPositionType === typeFilter)
    )
  }, [active, earlier, view, search, typeFilter])

  if (error) return <FullPageError />

  if (loading || !data) return <FullContentLoader />

  const breadcrumbs = [
    { label: 'Hjem', path: '/dashboard' },
    { label: 'Interngjengene', path: '/internal-groups' },
  ]

  return (
    <Stack>
      <Breadcrumbs items={breadcrumbs} />
      <Group justify="space-between">
        <Title>Administrer medlemskap</Title>
        <Button
          leftSection={<IconPlus size={16} />}
          onClick={() => setModalOpen(true)}
        >
          Tilegn nytt verv
        </Button>
      </Group>

      <Group justify="space-between" wrap="wrap">
        <SegmentedControl
          value={view}
          onChange={value => setView(value as View)}
          data={[
            { value: 'active', label: `Aktive (${active.length})` },
            { value: 'earlier', label: `Tidligere (${earlier.length})` },
            { value: 'all', label: 'Alle' },
          ]}
        />
        <Group gap="xs" wrap="nowrap">
          <TextInput
            placeholder="Søk etter navn"
            leftSection={<IconSearch size={16} />}
            value={search}
            onChange={event => setSearch(event.currentTarget.value)}
          />
          <Select
            placeholder="Alle typer"
            clearable
            data={internalGroupPositionTypeOptions}
            value={typeFilter}
            onChange={setTypeFilter}
            w={180}
          />
          <Popover width={360} position="bottom-end" withArrow shadow="md">
            <Popover.Target>
              <ActionIcon
                variant="subtle"
                color="gray"
                size="lg"
                aria-label="Hjelp"
              >
                <IconInfoCircle size={20} />
              </ActionIcon>
            </Popover.Target>
            <Popover.Dropdown>
              <Stack gap="xs">
                <Text size="sm">
                  Trykk på typen for å endre den, for eksempel ved permisjon
                  eller når noen blir aktiv pang. Har personen fått et nytt
                  verv, for eksempel fra Barista til KA, bruker du «Tilegn nytt
                  verv».
                </Text>
                <Text size="sm">
                  Feil i tidligere verv retter du med «Rediger vervhistorikk» i
                  menyen på hver rad.
                </Text>
                <Text size="sm">
                  <b>Obs!</b> Når noen blir eller slutter som funksjonær, endres
                  brukertypen Funksjonær bare hvis du har tilgang til å endre
                  brukertyper. Ellers må en admin gjøre det.
                </Text>
              </Stack>
            </Popover.Dropdown>
          </Popover>
        </Group>
      </Group>

      <UserManagementTable records={records} onEditHistory={setHistoryUserId} />

      <Modal opened={modalOpen} onClose={() => setModalOpen(false)}>
        <UserManagementAddUser setModalOpen={setModalOpen} />
      </Modal>
      <Drawer
        opened={historyUserId !== null}
        onClose={() => setHistoryUserId(null)}
        title="Rediger vervhistorikk"
        position="right"
        size="xl"
      >
        {historyUserId && (
          <MembershipHistoryEditor
            userId={historyUserId}
            onClose={() => setHistoryUserId(null)}
          />
        )}
      </Drawer>
    </Stack>
  )
}
