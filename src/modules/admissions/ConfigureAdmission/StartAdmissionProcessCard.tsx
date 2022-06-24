import { useMutation } from '@apollo/client'
import { Button, Text, Title } from '@mantine/core'
import styled from 'styled-components'
import { CREATE_ADMISSION } from '../mutations'
import { CreateAdmissionReturns, CreateAdmissionVariables } from '../types'
import { WizardStage } from './types'

const Wrapper = styled.div``

interface StartAdmissionProcessCardProps {
  setStageCallback: (stage: WizardStage) => void
}
export const StartAdmissionProcessCard: React.VFC<
  StartAdmissionProcessCardProps
> = ({ setStageCallback }) => {
  const [openAdmission] = useMutation<
    CreateAdmissionReturns,
    CreateAdmissionVariables
  >(CREATE_ADMISSION, {
    refetchQueries: ['ActiveAdmission'],
    onCompleted() {
      setStageCallback('SCHEDULE')
    },
  })

  const handleOpenAdmission = () => {
    openAdmission({
      variables: {
        input: {
          availableInternalGroupPositions: [],
          status: 'CONFIGURATION',
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
