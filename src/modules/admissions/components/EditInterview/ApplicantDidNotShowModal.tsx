import { Button, Group, Modal, Text } from '@mantine/core'

interface ApplicantDidNotShowModalProps {
  opened: boolean
  onClose: () => void
  applicantDidNotShowCallback: () => void
}

export const ApplicantDidNotShowModal: React.FC<
  ApplicantDidNotShowModalProps
> = ({ opened, onClose, applicantDidNotShowCallback }) => {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={<Text weight="bold">Kandidat møtte ikke opp</Text>}
    >
      <Text>
        Er du sikker på at du vil melde at kandidaten ikke møtte opp? Det er
        ikke mulig å angre på denne handling
      </Text>
      <Group position="right">
        <Button onClick={onClose}>Avbryt</Button>
        <Button color="red" onClick={applicantDidNotShowCallback}>
          Møtte aldri opp
        </Button>
      </Group>
    </Modal>
  )
}
