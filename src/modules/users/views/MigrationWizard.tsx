import { gql, useQuery } from '@apollo/client'
import { Container, createStyles, Stack, Title } from '@mantine/core'
import { FullPageError } from 'components/FullPageComponents'
import { FullContentLoader } from 'components/Loading'
import { MessageBox } from 'components/MessageBox'
import { UserMigrationWizardForm } from '../components/UserMigrationWizardForm'
import { MyWizardQueryReturns } from '../types'

const MY_WIZARD_QUERY = gql`
  query Me {
    me {
      id
      firstName
      lastName
      email
      phone
      nickname
      homeTown
      studyAddress
      study
      dateOfBirth
      bankAccount {
        id
        cardUuid
      }
    }
  }
`

export const MigrationWizard: React.FC = () => {
  const { classes } = useMigrationWizardStyles()

  // me query
  const { data, loading, error } =
    useQuery<MyWizardQueryReturns>(MY_WIZARD_QUERY)

  if (error) return <FullPageError />

  if (loading || !data) {
    return <FullContentLoader />
  }

  const { me } = data

  return (
    <Container className={classes.container}>
      <Stack>
        <Title>Velkommen til KSG-nett</Title>
        <MessageBox type="info">
          Den første gangen du logger inn her har du mulighet til å korrigere
          informasjon. Vi flytter over kallenavn til en egen kolonne slik at det
          skal bli lettere for de som holder på med krysselister å kunne finne
          riktige navn på listene. Gjerne flytt eventuelle kallenavn til
          kallenavn-feltet.
        </MessageBox>

        <UserMigrationWizardForm user={me} />
      </Stack>
    </Container>
  )
}

const useMigrationWizardStyles = createStyles(theme => ({
  container: {},
}))
