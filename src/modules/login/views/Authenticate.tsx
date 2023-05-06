import { Center, Loader } from '@mantine/core'
import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { setLoginToken } from 'util/auth'
import { useJwtTokenFromQueryString } from '../hooks'

export const Authenticate: React.FC = () => {
  const { token } = useJwtTokenFromQueryString()
  const navigate = useNavigate()
  const firstRender = useRef(true)

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      return
    }

    if (token) {
      handleLogin()
    }
  }, [token])

  if (!token) {
    return <div>Oida, her gikk noe galt</div>
  }

  function handleLogin() {
    setLoginToken(token)
    navigate('/dashboard')
    window.location.reload()
  }

  return (
    <Center>
      <Loader />
    </Center>
  )
}
