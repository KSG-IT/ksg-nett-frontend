import { ActionIcon, Menu, Modal, Table } from '@mantine/core'
import { IconDots, IconEye, IconTrash } from '@tabler/icons-react'
import { CardTable } from 'components/CardTable'
import { PermissionGate } from 'components/PermissionGate'
import { useApplicantMutations } from 'modules/admissions/mutations.hooks'
import { parseApplicantPriorityInternalGroupPosition } from 'modules/admissions/parsing'
import { CoreApplicantNode } from 'modules/admissions/types.graphql'
import { useDeferredValue, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ApplicantStatusBadge } from '../ApplicantStatusBadge'
import { DeleteApplicantModal } from './DeleteApplicantModal'
import { CURRENT_APPLICANTS_QUERY } from 'modules/admissions/queries'

interface ApplicantsTableProps {
  applicants: CoreApplicantNode[]
  filterQuery: string
}

export const ApplicantsTable: React.FC<ApplicantsTableProps> = ({
  applicants,
  filterQuery,
}) => {
  const deferredFilterQuery = useDeferredValue(filterQuery)

  const navigate = useNavigate()
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [applicantToDelete, setApplicantToDelete] =
    useState<CoreApplicantNode | null>(null)

  const handleMoreInfo = (applicantId: string) => {
    navigate(`/admissions/applicants/${applicantId}`)
  }

  const { deleteApplicant } = useApplicantMutations()

  async function handleDeleteApplicant() {
    if (applicantToDelete === null) return
    return deleteApplicant({
      variables: {
        id: applicantToDelete.id,
      },
      refetchQueries: [CURRENT_APPLICANTS_QUERY],
    })
  }

  const rows = useMemo(() => {
    return applicants
      .filter(
        applicant =>
          applicant.fullName
            .toLowerCase()
            .includes(deferredFilterQuery.toLowerCase()) ||
          applicant.email
            .toLowerCase()
            .includes(deferredFilterQuery.toLowerCase()) ||
          applicant.phone.includes(deferredFilterQuery)
      )
      .map(applicant => (
        <Table.Tr key={applicant.id}>
          <Table.Td>
            <Link to={`/admissions/applicants/${applicant.id}`}>
              {applicant.fullName}
            </Link>
          </Table.Td>
          <Table.Td>{applicant.email}</Table.Td>
          <Table.Td>
            <ApplicantStatusBadge applicantStatus={applicant.status} />
          </Table.Td>
          <Table.Td>
            {parseApplicantPriorityInternalGroupPosition(
              applicant.priorities[0]
            )}
          </Table.Td>
          <Table.Td>
            {parseApplicantPriorityInternalGroupPosition(
              applicant.priorities[1]
            )}
          </Table.Td>
          <Table.Td>
            {parseApplicantPriorityInternalGroupPosition(
              applicant.priorities[2]
            )}
          </Table.Td>

          <Table.Td>
            <Menu position="left-start">
              <Menu.Target>
                <ActionIcon>
                  <IconDots size={16} stroke={1.5} />
                </ActionIcon>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Label>Valg</Menu.Label>
                <Menu.Item
                  leftSection={<IconEye />}
                  onClick={() => handleMoreInfo(applicant.id)}
                >
                  Mer info
                </Menu.Item>

                <PermissionGate permissions={'admissions.delete_applicant'}>
                  <Menu.Label>Admin</Menu.Label>
                  <Menu.Item
                    leftSection={<IconTrash />}
                    color="red"
                    onClick={() => {
                      setApplicantToDelete(applicant)
                      setDeleteModalOpen(true)
                    }}
                  >
                    Slett søker
                  </Menu.Item>
                </PermissionGate>
              </Menu.Dropdown>
            </Menu>
          </Table.Td>
        </Table.Tr>
      ))
  }, [applicants, deferredFilterQuery])

  return (
    <>
      <CardTable compact>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Navn</Table.Th>
            <Table.Th>Epost</Table.Th>
            <Table.Th>Status</Table.Th>
            <Table.Th>Prio 1</Table.Th>
            <Table.Th>Prio 2</Table.Th>
            <Table.Th>Prio 3</Table.Th>
            <Table.Th>Handlinger</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </CardTable>
      <Modal
        opened={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Slett søker"
      >
        <DeleteApplicantModal
          applicant={applicantToDelete}
          deleteApplicantCallback={handleDeleteApplicant}
          closeModalCallback={() => setDeleteModalOpen(false)}
        />
      </Modal>
    </>
  )
}
