import {
  ActionIcon,
  Anchor,
  Menu,
  Modal,
  Table,
  Text,
  VisuallyHidden,
} from '@mantine/core'
import { IconDots, IconEye, IconTrash } from '@tabler/icons-react'
import { PermissionGate } from 'components/PermissionGate'
import { SortableTh, TableDensity, useTableSort } from 'components/Table'
import { ApplicantStatusValues } from 'modules/admissions/consts'
import { useApplicantMutations } from 'modules/admissions/mutations.hooks'
import { CURRENT_APPLICANTS_QUERY } from 'modules/admissions/queries'
import { CoreApplicantNode } from 'modules/admissions/types.graphql'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ApplicantStatusBadge } from '../ApplicantStatusBadge'
import { DeleteApplicantModal } from './DeleteApplicantModal'

// Status sorts in the order an applicant moves through the admission
const STATUS_ORDER = Object.values(ApplicantStatusValues)

const priorityName = (applicant: CoreApplicantNode, index: number) =>
  applicant.priorities[index]?.internalGroupPosition.name ?? null

const SORT_GETTERS = {
  name: (applicant: CoreApplicantNode) => applicant.fullName,
  email: (applicant: CoreApplicantNode) => applicant.email,
  status: (applicant: CoreApplicantNode) =>
    STATUS_ORDER.indexOf(applicant.status),
  priority1: (applicant: CoreApplicantNode) => priorityName(applicant, 0),
  priority2: (applicant: CoreApplicantNode) => priorityName(applicant, 1),
  priority3: (applicant: CoreApplicantNode) => priorityName(applicant, 2),
}

interface ApplicantsTableProps {
  applicants: CoreApplicantNode[]
  density: TableDensity
  tableProps: React.ComponentProps<typeof Table>
}

export const ApplicantsTable: React.FC<ApplicantsTableProps> = ({
  applicants,
  density,
  tableProps,
}) => {
  const navigate = useNavigate()
  const [applicantToDelete, setApplicantToDelete] =
    useState<CoreApplicantNode | null>(null)
  const { deleteApplicant } = useApplicantMutations()
  const { sorted, headerProps } = useTableSort(applicants, SORT_GETTERS, {
    sortBy: 'name',
    direction: 'asc',
  })
  const compact = density === 'compact'

  async function handleDeleteApplicant() {
    if (applicantToDelete === null) return
    return deleteApplicant({
      variables: { id: applicantToDelete.id },
      refetchQueries: [CURRENT_APPLICANTS_QUERY],
    })
  }

  const rows = sorted.map(applicant => (
    <Table.Tr key={applicant.id}>
      <Table.Td style={{ whiteSpace: 'nowrap' }}>
        <Anchor
          component={Link}
          to={`/admissions/applicants/${applicant.id}`}
          fz="inherit"
          fw={500}
        >
          {applicant.fullName}
        </Anchor>
      </Table.Td>
      <Table.Td>
        <Text
          fz="inherit"
          truncate
          maw={compact ? 190 : 260}
          title={applicant.email}
        >
          {applicant.email}
        </Text>
      </Table.Td>
      <Table.Td style={{ whiteSpace: 'nowrap' }}>{applicant.phone}</Table.Td>
      <Table.Td>
        <ApplicantStatusBadge applicantStatus={applicant.status} />
      </Table.Td>
      {[0, 1, 2].map(index => (
        <Table.Td key={index}>
          {priorityName(applicant, index) ?? (
            <Text fz="inherit" c="dimmed" span>
              –
            </Text>
          )}
        </Table.Td>
      ))}
      <Table.Td ta="right">
        <Menu position="bottom-end" withinPortal>
          <Menu.Target>
            <ActionIcon
              variant="subtle"
              color="gray"
              size={compact ? 'sm' : 'md'}
              aria-label="Flere valg"
            >
              <IconDots size={16} stroke={1.5} />
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item
              leftSection={<IconEye size={16} />}
              onClick={() => navigate(`/admissions/applicants/${applicant.id}`)}
            >
              Mer info
            </Menu.Item>
            <PermissionGate permissions={'admissions.delete_applicant'}>
              <Menu.Divider />
              <Menu.Item
                leftSection={<IconTrash size={16} />}
                color="red"
                onClick={() => setApplicantToDelete(applicant)}
              >
                Slett søker
              </Menu.Item>
            </PermissionGate>
          </Menu.Dropdown>
        </Menu>
      </Table.Td>
    </Table.Tr>
  ))

  return (
    <>
      <Table.ScrollContainer minWidth={900}>
        <Table
          {...tableProps}
          highlightOnHover
          stickyHeader
          withTableBorder
          striped={compact}
        >
          <Table.Thead>
            <Table.Tr>
              <SortableTh {...headerProps('name')}>Navn</SortableTh>
              <SortableTh {...headerProps('email')}>E-post</SortableTh>
              <Table.Th>Telefon</Table.Th>
              <SortableTh {...headerProps('status')}>Status</SortableTh>
              <SortableTh {...headerProps('priority1')}>1. prio</SortableTh>
              <SortableTh {...headerProps('priority2')}>2. prio</SortableTh>
              <SortableTh {...headerProps('priority3')}>3. prio</SortableTh>
              <Table.Th w={36}>
                <VisuallyHidden>Valg</VisuallyHidden>
              </Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {rows.length > 0 ? (
              rows
            ) : (
              <Table.Tr>
                <Table.Td colSpan={8}>
                  <Text ta="center" c="dimmed" fz="sm" py="lg">
                    Ingen søkere
                  </Text>
                </Table.Td>
              </Table.Tr>
            )}
          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>
      <Modal
        opened={applicantToDelete !== null}
        onClose={() => setApplicantToDelete(null)}
        title="Slett søker"
      >
        <DeleteApplicantModal
          applicant={applicantToDelete}
          deleteApplicantCallback={handleDeleteApplicant}
          closeModalCallback={() => setApplicantToDelete(null)}
        />
      </Modal>
    </>
  )
}
