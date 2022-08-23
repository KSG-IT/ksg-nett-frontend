import { Button, Group, Modal, Text } from '@mantine/core'

interface LockInterviewModalProps {
  opened: boolean
  onClose: () => void
  lockInterviewCallback: () => void
}

export const LockInterviewModal: React.FC<LockInterviewModalProps> = ({
  opened,
  onClose,
  lockInterviewCallback,
}) => {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={<Text weight="bold">Lås intervju</Text>}
    >
      <Text>
        Er du sikker på at du har notert ferdig? Det er ikke mulig å redigere
        intervjuet etter denne handlingen!
      </Text>
      <Group position="right">
        <Button onClick={onClose}>Avbryt</Button>
        <Button color="red" onClick={lockInterviewCallback}>
          Lås notater
        </Button>
      </Group>
    </Modal>
  )
}
