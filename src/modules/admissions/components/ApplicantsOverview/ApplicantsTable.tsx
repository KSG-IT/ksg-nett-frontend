import { ActionIcon, Menu, Modal } from '@mantine/core'
import { IconDots, IconEye, IconTrash } from '@tabler/icons'
import { CardTable } from 'components/CardTable'
import { PermissionGate } from 'components/PermissionGate'
import { useApplicantMutations } from 'modules/admissions/mutations.hooks'
import { parseApplicantPriorityInternalGroupPosition } from 'modules/admissions/parsing'
import { CoreApplicantNode } from 'modules/admissions/types.graphql'
import { useDeferredValue, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
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
        <tr key={applicant.id}>
          <td>{applicant.fullName}</td>
          <td>{applicant.email}</td>
          <td>
            <ApplicantStatusBadge applicantStatus={applicant.status} />
          </td>
          <td>
            {parseApplicantPriorityInternalGroupPosition(
              applicant.priorities[0]
            )}
          </td>
          <td>
            {parseApplicantPriorityInternalGroupPosition(
              applicant.priorities[1]
            )}
          </td>
          <td>
            {parseApplicantPriorityInternalGroupPosition(
              applicant.priorities[2]
            )}
          </td>

          <td>
            <Menu position="left-start">
              <Menu.Target>
                <ActionIcon>
                  <IconDots size={16} stroke={1.5} />
                </ActionIcon>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Label>Valg</Menu.Label>
                <Menu.Item
                  icon={<IconEye />}
                  onClick={() => handleMoreInfo(applicant.id)}
                >
                  Mer info
                </Menu.Item>

                <PermissionGate permissions={'admissions.delete_applicant'}>
                  <Menu.Label>Admin</Menu.Label>
                  <Menu.Item
                    icon={<IconTrash />}
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
          </td>
        </tr>
      ))
  }, [applicants, deferredFilterQuery])

  return (
    <>
      <CardTable compact>
        <thead>
          <tr>
            <th>Navn</th>
            <th>Epost</th>
            <th>Status</th>
            <th>Prio 1</th>
            <th>Prio 2</th>
            <th>Prio 3</th>
            <th>Handlinger</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
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
