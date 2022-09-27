import { useQuery } from '@apollo/client'
import { Stack, Title } from '@mantine/core'
import { FullPageError } from 'components/FullPageComponents'
import { FullContentLoader } from 'components/Loading'
import { MessageBox } from 'components/MessageBox'
import { NoticeTable } from '../components/ApplicantNotices/NoticeTable'
import { APPLICANT_NOTICES_QUERY } from '../queries'

export const ApplicantNotices: React.VFC = () => {
  const { data, loading, error } = useQuery(APPLICANT_NOTICES_QUERY, {
    pollInterval: 30000,
  })

  if (error) return <FullPageError />

  if (loading || !data) {
    return <FullContentLoader />
  }

  const { applicantNotices } = data

  return (
    <Stack>
      <Title>Søkere å følge opp</Title>
      <MessageBox type="info">
        Her har du oversikt over alle søkerne som ikke har registrert et ønske
        hos en interngjeng. Det er mulig å se når de sist gjorde en aktivitet og
        sist noen fra KSG har prøvd å ta kontakt med søkeren. Det er mulig å
        legge til en kommentar på søkerne for andre intervjuere å se.
      </MessageBox>
      <NoticeTable applicants={applicantNotices} />
    </Stack>
  )
}
