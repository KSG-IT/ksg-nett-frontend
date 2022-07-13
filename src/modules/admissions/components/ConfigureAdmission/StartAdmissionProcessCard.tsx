import { useMutation } from '@apollo/client'
import { Button, Text, Title } from '@mantine/core'
import { AdmissionStatusValues } from 'modules/admissions/consts'
import { CREATE_ADMISSION } from 'modules/admissions/mutations'
import {
  CreateAdmissionReturns,
  CreateAdmissionVariables,
} from 'modules/admissions/types.graphql'
import styled from 'styled-components'

const Wrapper = styled.div``

type WizardStage =
  | 'START'
  | 'SCHEDULE'
  | 'INTERVIEW_LOCATION_AVAILABILITY'
  | 'INTERVIEW_TEMPLATE'
  | 'AVAILABLE_POSITIONS'
  | 'SUMMARY'
  | null

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
    <Wrapper>
      <Title>Opptak</Title>
      <Text>
        Det er foreløpig ikke noe aktiv opptak. Her har du mulighet til å starte
        et opptak og også legge til nye brukere. Er det noen du har glemt å
        registrere på et opptak? Isåfall vil du bruke <b>Legg til ny bruker</b>
      </Text>
      <Button onClick={handleOpenAdmission}>Start nytt opptak</Button>
      <div>Noen du har glemt å legge til?</div>
      <Button>Legg til ny bruker</Button>
    </Wrapper>
  )
}
