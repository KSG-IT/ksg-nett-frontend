import { Button, Group, Modal, Stack, Text, Title } from '@mantine/core'
import { ApplicantStatusValues } from 'modules/admissions/consts'
import { usePatchApplicant } from 'modules/admissions/mutations.hooks'
import { ApplicantNode } from 'modules/admissions/types.graphql'

interface RetractApplicationModalProps {
  applicant: ApplicantNode
  opened: boolean
  setOpened: (open: boolean) => void
}

export const RetractApplicationModal: React.VFC<
  RetractApplicationModalProps
> = ({ applicant, opened, setOpened }) => {
  const { patchApplicant, loading } = usePatchApplicant()

  const handleRetractApplication = () => {
    patchApplicant({
      refetchQueries: ['GetApplicantFromToken'],
      variables: {
        id: applicant.id,
        input: {
          status: ApplicantStatusValues.RETRACTED_APPLICATION,
        },
      },
      onCompleted() {
        setOpened(false)
      },
    })
  }

  return (
    <Modal opened={opened} onClose={() => setOpened(false)}>
      <Stack>
        <Title>Trekk søknad</Title>
        <Text>
          Er du sikker på at du vil trekke søknaden din? Denne handlingen kan
          ikke trekkes tilbake
        </Text>
        <Group>
          <Button color="gray" onClick={() => setOpened(false)}>
            Avbryt
          </Button>
          <Button
            loading={loading}
            color="red"
            onClick={handleRetractApplication}
          >
            Trekk søknad
          </Button>
        </Group>
      </Stack>
    </Modal>
  )
}
