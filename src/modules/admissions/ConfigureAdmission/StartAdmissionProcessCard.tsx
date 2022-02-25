import { useMutation } from '@apollo/client'
import { Button } from 'components/Button'
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
  // Before opening the admission process we need to
  // decide how many each internal gorup is accepting
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
      <div>Ikke noe opptak på gang</div>
      <Button onClick={handleOpenAdmission}>Start nytt opptak</Button>
      <div>Noen du har glemt å legge til?</div>
      <Button>Legg til ny bruker</Button>
    </Wrapper>
  )
}
