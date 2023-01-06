import { useQuery } from '@apollo/client'
import { Container, Text, Title } from '@mantine/core'
import { FullPageError } from 'components/FullPageComponents'
import { FullContentLoader } from 'components/Loading'
import { MessageBox } from 'components/MessageBox'
import { FirstTimeLoginForm } from '../components/FirstTimeLoginForm'
import { ME_QUERY } from '../queries'
import { MeQueryReturns } from '../types'

export const FirstTimeLogin: React.FC = () => {
  const { data, loading, error } = useQuery<MeQueryReturns>(ME_QUERY)

  if (error) return <FullPageError />

  if (loading || !data) return <FullContentLoader />

  const { me } = data

  return (
    <Container>
      <Title>Hei, {me?.getCleanFullName}!</Title>
      <MessageBox type="info">
        Før du har mulighet til å logge inn trenger vi at du svarer på følgende
        spørsmål.
      </MessageBox>
      <FirstTimeLoginForm />
    </Container>
  )
}
