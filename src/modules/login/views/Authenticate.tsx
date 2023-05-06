import { Button, Center } from '@mantine/core'
import { useNavigate } from 'react-router-dom'
import { setLoginToken } from 'util/auth'
import { useJwtTokenFromQueryString } from '../hooks'
import { getLoginToken } from 'util/auth'

export const Authenticate: React.FC = () => {
  /**
   * This component is used to load a jwt token sent from backend emails to log in.
   *
   * Load the jwt from query params and store it in local storage. THen redirect
   */

  const { token } = useJwtTokenFromQueryString()
  const navigate = useNavigate()

  if (!token) {
    return <div>Oida, her gikk noe galt</div>
  }

  function handleLogin() {
    console.log(token)
    setLoginToken(token)
    console.log(getLoginToken())
    navigate('/dashboard')
    window.location.reload()
  }

  return (
    <Center>
      <Button onClick={handleLogin}>Logg inn</Button>
    </Center>
  )
}
