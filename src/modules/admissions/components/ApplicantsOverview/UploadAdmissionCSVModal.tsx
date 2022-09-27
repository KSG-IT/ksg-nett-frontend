import { Button, FileInput, Modal, Stack, Table } from '@mantine/core'
import { IconFileCode, IconUpload, IconUserPlus } from '@tabler/icons'
import { MessageBox } from 'components/MessageBox'
import { useApplicantMutations } from 'modules/admissions/mutations.hooks'
import { ApplicantCSVData } from 'modules/admissions/types.graphql'
import { useState } from 'react'
import toast from 'react-hot-toast'

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
    }).then(res => {
      // In order to not break the mutation we need to get rid of the __typename property for each entry
      const parsedResult = res.data.uploadApplicantsCsv.validApplicants.map(
        ({ __typename, ...rest }: any) => rest
      )
      setResult(parsedResult)
      toast.success('Søkere behandlet fra fil')
    })
  }

  function handleCreateProfiles() {
    createApplicantsFromCSVDataMutation({
      variables: { applicants: result },
      refetchQueries: ['CurrentApplicantsQuery'],
    })
      .then(res => {
        toast.success('Søkere opprettet')
        setResult([])
        setFile(null)
        onClose()
      })
      .catch(err => {
        toast.error('Noe gikk galt')
        console.error(err)
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
          leftIcon={<IconUpload />}
          disabled={!file}
          type="submit"
          onClick={handleUploadFile}
        >
          Send fil til behandling
        </Button>
      </Stack>
      <Button
        disabled={result.length === 0 || !file}
        loading={createApplicantsFromCSVLoading}
        leftIcon={<IconUserPlus />}
        my="md"
        onClick={handleCreateProfiles}
      >
        Lag brukere for søkere
      </Button>

      <Table>
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
      </Table>
    </Modal>
  )
}
