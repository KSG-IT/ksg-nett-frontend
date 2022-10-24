import { Button, Menu, Modal } from '@mantine/core'
import { IconDots, IconEye, IconTrash } from '@tabler/icons'
import { CardTable } from 'components/CardTable'
import { PermissionGate } from 'components/PermissionGate'
import { useApplicantMutations } from 'modules/admissions/mutations.hooks'
import { parseApplicantPriorityInternalGroupPosition } from 'modules/admissions/parsing'
import { CoreApplicantNode } from 'modules/admissions/types.graphql'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ApplicantStatusBadge } from '../ApplicantStatusBadge'
import { DeleteApplicantModal } from './DeleteApplicantModal'

interface ApplicantsTableProps {
  applicants: CoreApplicantNode[]
}

export const ApplicantsTable: React.FC<ApplicantsTableProps> = ({
  applicants,
}) => {
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
      refetchQueries: ['CurrentApplicantsQuery'],
    })
  }

  const rows = applicants.map(applicant => (
    <tr key={applicant.id}>
      <td>{applicant.fullName}</td>
      <td>{applicant.email}</td>
      <td>
        <ApplicantStatusBadge applicantStatus={applicant.status} />
      </td>
      <td>
        {parseApplicantPriorityInternalGroupPosition(applicant.priorities[0])}
      </td>
      <td>
        {parseApplicantPriorityInternalGroupPosition(applicant.priorities[1])}
      </td>
      <td>
        {parseApplicantPriorityInternalGroupPosition(applicant.priorities[2])}
      </td>

      <td>
        <Menu position="left-start">
          <Menu.Target>
            <Button variant="outline" color="samfundet-red">
              <IconDots />
            </Button>
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

  return (
    <>
      <CardTable>
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
