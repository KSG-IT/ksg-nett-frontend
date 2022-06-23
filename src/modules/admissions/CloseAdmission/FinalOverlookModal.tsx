import { useMutation } from '@apollo/client'
import { Button, LoadingOverlay, Modal, Stack, Title } from '@mantine/core'
import { useHistory } from 'react-router-dom'
import { CLOSE_ADMISSION_MUTATION } from '../AdmissionDashboard/mutations'
import { ResultPreview } from './ResultPreview'

export const FinalOverlookModal: React.VFC<{
  opened: boolean
  onClose: () => void
}> = ({ opened, onClose }) => {
  const history = useHistory()
  const [closeAdmission, { loading: mutationLoading }] = useMutation(
    CLOSE_ADMISSION_MUTATION,
    {
      onCompleted() {
        history.push('/users/newbies')
      },
    }
  )
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
        <Button onClick={() => closeAdmission()}>Avslutt opptaket</Button>
      </Stack>
      <LoadingOverlay visible={mutationLoading} />
    </Modal>
  )
}
