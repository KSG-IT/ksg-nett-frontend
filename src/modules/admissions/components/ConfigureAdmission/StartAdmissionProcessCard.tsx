import { useMutation } from '@apollo/client'
import { Button, Group, Stack, Text, Title } from '@mantine/core'
import { PermissionGate } from 'components/PermissionGate'
import { AdmissionStatusValues } from 'modules/admissions/consts'
import { CREATE_ADMISSION } from 'modules/admissions/mutations'
import {
  CreateAdmissionReturns,
  CreateAdmissionVariables,
} from 'modules/admissions/types.graphql'
import { PERMISSIONS } from 'util/permissions'

type WizardStage =
  | 'START'
  | 'SCHEDULE'
  | 'INTERVIEW_LOCATION_AVAILABILITY'
  | 'INTERVIEW_TEMPLATE'
  | 'AVAILABLE_POSITIONS'
  | 'SUMMARY'

interface StartAdmissionProcessCardProps {
  setStageCallback: (stage: WizardStage) => void
}
export const StartAdmissionProcessCard: React.VFC<
  StartAdmissionProcessCardProps
> = ({ setStageCallback }) => {
  const [createAdmission] = useMutation<
    CreateAdmissionReturns,
    CreateAdmissionVariables
  >(CREATE_ADMISSION, {
    refetchQueries: ['ActiveAdmission'],
    onCompleted() {
      setStageCallback('SCHEDULE')
    },
  })

  const handleOpenAdmission = () => {
    createAdmission({
      variables: {
        input: {
          availableInternalGroupPositions: [],
          status: AdmissionStatusValues.CONFIGURATION,
        },
      },
    })
  }
  return (
    <Stack>
      <Title>Opptak</Title>
      <PermissionGate permissions={PERMISSIONS.admissions.change.admission}>
        <Text>
          Det er foreløpig ikke noe aktiv opptak. Her har du mulighet til å
          starte et opptak og også legge til nye brukere. Er det noen du har
          glemt å registrere på et opptak? Isåfall vil du bruke{' '}
          <b>Legg til ny bruker</b>
        </Text>
        <Group>
          <Button onClick={handleOpenAdmission}>Start nytt opptak</Button>
        </Group>
        <div>Noen du har glemt å legge til?</div>
        <Button>Legg til ny bruker</Button>
      </PermissionGate>
    </Stack>
  )
}
