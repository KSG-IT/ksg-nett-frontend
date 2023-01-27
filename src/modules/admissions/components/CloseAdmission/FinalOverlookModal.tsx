import { Button, LoadingOverlay, Modal, Stack, Title } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { useAdmissionMutations } from 'modules/admissions/mutations.hooks'
import {
  ACTIVE_ADMISSION_QUERY,
  VALID_APPLICANTS_QUERY,
} from 'modules/admissions/queries'
import { useNavigate } from 'react-router-dom'
import { usePermissions } from 'util/hooks/usePermissions'
import { PERMISSIONS } from 'util/permissions'
import { ResultPreview } from './ResultPreview'

export const FinalOverlookModal: React.VFC<{
  opened: boolean
  onClose: () => void
}> = ({ opened, onClose }) => {
  const navigate = useNavigate()
  const { hasPermissions } = usePermissions()

  const { closeAdmission, closeAdmissionLoading } = useAdmissionMutations()

  const handleCloseAdmission = () => {
    closeAdmission({
      refetchQueries: [VALID_APPLICANTS_QUERY, ACTIVE_ADMISSION_QUERY],
      onCompleted() {
        showNotification({
          title: 'Suksess',
          message: 'Opptaket er nå avsluttet',
        })
        navigate('/admissions')
      },
      onError({ message }) {
        showNotification({
          title: 'Noe gikk galt',
          message: message,
        })
      },
    })
  }
  return (
    <Modal
      onClose={onClose}
      opened={opened}
      size="xl"
      title={<Title order={3}>Almost there</Title>}
    >
      <Stack>
        <ResultPreview />
        <Button
          disabled={!hasPermissions(PERMISSIONS.admissions.change.admission)}
          color="samfundet-red"
          onClick={handleCloseAdmission}
        >
          Avslutt opptaket
        </Button>
      </Stack>
      <LoadingOverlay color="samfundet-red" visible={closeAdmissionLoading} />
    </Modal>
  )
}
