import { Button, LoadingOverlay, Modal, Stack, Title } from '@mantine/core'
import { useAdmissionMutations } from 'modules/admissions/mutations.hooks'
import { useHistory } from 'react-router-dom'
import { ResultPreview } from './ResultPreview'

export const FinalOverlookModal: React.VFC<{
  opened: boolean
  onClose: () => void
}> = ({ opened, onClose }) => {
  const history = useHistory()

  const { closeAdmission, closeAdmissionLoading } = useAdmissionMutations()

  const handleCloseAdmission = () => {
    closeAdmission({
      onCompleted() {
        history.push('/users/newbies')
      },
    })
  }
  return (
    <Modal
      onClose={onClose}
      opened={opened}
      title={<Title order={3}>Almost there</Title>}
    >
      <Stack
        style={{ overflowY: 'scroll', height: '600px' }}
        justify="space-evenly"
      >
        <ResultPreview />
        <Button onClick={handleCloseAdmission}>Avslutt opptaket</Button>
      </Stack>
      <LoadingOverlay visible={closeAdmissionLoading} />
    </Modal>
  )
}
