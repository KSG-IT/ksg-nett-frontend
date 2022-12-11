import { Button, FileInput, Modal, Stack } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { IconFileCode, IconUpload, IconUserPlus } from '@tabler/icons'
import { CardTable } from 'components/CardTable'
import { MessageBox } from 'components/MessageBox'
import { useApplicantMutations } from 'modules/admissions/mutations.hooks'
import { CURRENT_APPLICANTS_QUERY } from 'modules/admissions/queries'
import { ApplicantCSVData } from 'modules/admissions/types.graphql'
import { useState } from 'react'

interface UploadAdmissionCSVModalProps {
  opened: boolean
  onClose: () => void
}

export const UploadAdmissionCSVModal: React.FC<
  UploadAdmissionCSVModalProps
> = ({ opened, onClose }) => {
  const [file, setFile] = useState<File | null>(null)

  // Move this to hook and remember to add typing
  const {
    uploadApplicantCSVDataMutation,
    createApplicantsFromCSVDataMutation,
    createApplicantsFromCSVLoading,
  } = useApplicantMutations()

  const [result, setResult] = useState<ApplicantCSVData[]>([])

  function handleUploadFile() {
    uploadApplicantCSVDataMutation({
      variables: { applicantsFile: file },
      onCompleted({ uploadApplicantCSVData }) {
        // In order to not break the mutation we need to get rid of the __typename property for each entry
        const parsedResult = uploadApplicantCSVData.validApplicants.map(
          ({ __typename, ...rest }: any) => rest
        )
        setResult(parsedResult)
        showNotification({
          title: 'Opplasting fullført',
          message: 'Opplasting av CSV-fil fullført',
        })
      },
    })
  }

  function handleCreateProfiles() {
    createApplicantsFromCSVDataMutation({
      variables: { applicants: result },
      refetchQueries: [CURRENT_APPLICANTS_QUERY],
      onCompleted() {
        showNotification({
          title: 'Søkere opprettet',
          message: 'Søkere ble opprettet fra CSV-fil',
        })
        setResult([])
        onClose()
      },
      onError({ message }) {
        showNotification({
          title: 'Noe gikk galt',
          message,
        })
      },
    })
  }

  return (
    <Modal
      title="Last opp opptaksfil"
      opened={opened}
      onClose={onClose}
      size="xl"
    >
      <MessageBox type="info">
        Her kan du laste opp en <code>.csv</code> fil som du laster ned fra
        Samfundet in opptaksside. Etter at du har lastet den opp har du mulighet
        til å se over dataen og deretter opprette søknader.
      </MessageBox>
      <Stack my="md">
        <FileInput
          value={file}
          onChange={setFile}
          label="Velg en opptaksfil"
          accept="text/csv"
          placeholder="Trykk her"
          icon={<IconFileCode />}
          clearable
        />
        <Button
          color="samfundet-red"
          leftIcon={<IconUpload />}
          disabled={!file}
          type="submit"
          onClick={handleUploadFile}
        >
          Send fil til behandling
        </Button>
      </Stack>
      <Button
        color="samfundet-red"
        disabled={result.length === 0 || !file}
        loading={createApplicantsFromCSVLoading}
        leftIcon={<IconUserPlus />}
        my="md"
        onClick={handleCreateProfiles}
      >
        Lag brukere for søkere
      </Button>

      <CardTable>
        <thead>
          <tr>
            <th>Navn</th>
            <th>Telefon</th>
            <th>E-post</th>
          </tr>
        </thead>
        <tbody>
          {result.map(applicant => (
            <tr key={applicant.email}>
              <td>{applicant.fullName}</td>
              <td>{applicant.phone}</td>
              <td>{applicant.email}</td>
            </tr>
          ))}
        </tbody>
      </CardTable>
    </Modal>
  )
}
