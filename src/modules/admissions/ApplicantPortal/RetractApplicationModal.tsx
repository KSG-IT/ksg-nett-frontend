import { useMutation } from '@apollo/client'
import { Button, Group, Modal, Stack, Text, Title } from '@mantine/core'
import { PatchMutationVariables } from 'types/graphql'
import { PATCH_APPLICANT } from '../mutations'
import { ApplicantNode, PatchApplicantReturns } from '../types'

interface RetractApplicationModalProps {
  applicant: ApplicantNode
  opened: boolean
  setOpened: (open: boolean) => void
}

export const RetractApplicationModal: React.VFC<
  RetractApplicationModalProps
> = ({ applicant, opened, setOpened }) => {
  const [patchApplicant, { loading }] = useMutation<
    PatchApplicantReturns,
    PatchMutationVariables<ApplicantNode>
  >(PATCH_APPLICANT, {
    refetchQueries: ['GetApplicantFromToken'],
    variables: {
      id: applicant.id,
      input: {
        status: 'RETRACTED_APPLICATION',
      },
    },
    onCompleted() {
      setOpened(false)
    },
  })
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
            onClick={() => patchApplicant()}
          >
            Trekk søknad
          </Button>
        </Group>
      </Stack>
    </Modal>
  )
}
