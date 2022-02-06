import { useMutation } from '@apollo/client'
import { Button } from 'components/Button'
import styled from 'styled-components'
import { CREATE_ADMISSION } from './mutation'
import { CreateAdmissionReturns } from './types'

const Wrapper = styled.div``

export const StartAdmissionProcessCard: React.VFC = () => {
  // Before opening the admission process we need to
  // decide how many each internal gorup is accepting
  const [openAdmission] = useMutation<CreateAdmissionReturns>(
    CREATE_ADMISSION,
    { refetchQueries: ['ActiveAdmission'] }
  )

  const handleOpenAdmission = () => {
    openAdmission({
      variables: { input: { availableInternalGroupPositions: [] } },
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
