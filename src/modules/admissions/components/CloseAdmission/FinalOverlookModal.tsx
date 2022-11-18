import { Button, LoadingOverlay, Modal, Stack, Title } from '@mantine/core'
import { useAdmissionMutations } from 'modules/admissions/mutations.hooks'
import {
  ACTIVE_ADMISSION_QUERY,
  VALID_APPLICANTS_QUERY,
} from 'modules/admissions/queries'
import { useNavigate } from 'react-router-dom'
import { ResultPreview } from './ResultPreview'

export const FinalOverlookModal: React.VFC<{
  opened: boolean
  onClose: () => void
}> = ({ opened, onClose }) => {
  const navigate = useNavigate()

  const { closeAdmission, closeAdmissionLoading } = useAdmissionMutations()

  const handleCloseAdmission = () => {
    closeAdmission({
      onCompleted() {
        navigate('/admissions')
      },
      refetchQueries: [VALID_APPLICANTS_QUERY, ACTIVE_ADMISSION_QUERY],
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
        <Button color="samfundet-red" onClick={handleCloseAdmission}>
          Avslutt opptaket
        </Button>
      </Stack>
      <LoadingOverlay color="samfundet-red" visible={closeAdmissionLoading} />
    </Modal>
  )
}
