import { useQuery } from '@apollo/client'
import { Group, Stack, Title } from '@mantine/core'
import { Breadcrumbs } from 'components/Breadcrumbs'
import { FullPageError } from 'components/FullPageComponents'
import { FullContentLoader } from 'components/Loading'
import { MessageBox } from 'components/MessageBox'
import { NoticeTable } from '../components/ApplicantNotices/NoticeTable'
import { APPLICANT_NOTICES_QUERY } from '../queries'

const breadcrumbsItems = [
  { label: 'Home', path: '/dashboard' },
  { label: 'Orvik', path: '/admissions' },
  { label: 'Oppfølging', path: '' },
]

export const ApplicantNotices: React.FC = () => {
  const { data, loading, error } = useQuery(APPLICANT_NOTICES_QUERY, {
    pollInterval: 15_000,
    fetchPolicy: 'network-only',
  })

  if (error) return <FullPageError />

  if (loading || !data) {
    return <FullContentLoader />
  }

  const { applicantNotices } = data

  return (
    <Stack>
      <Breadcrumbs items={breadcrumbsItems} />
      <Group>
        <Title>Søkere å følge opp</Title>
      </Group>
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
