import { useQuery } from '@apollo/client'
import {
  Card,
  Center,
  Container,
  createStyles,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from '@mantine/core'
import { Breadcrumbs } from 'components/Breadcrumbs'
import { CardTable } from 'components/CardTable'
import { FullPageError } from 'components/FullPageComponents'
import { FullContentLoader } from 'components/Loading'
import { useIsMobile } from 'util/hooks'
import { INTERVIEW_STATISTICS_QUERY } from '../queries'
import { InterviewStatisticsReturns } from '../types.graphql'
import { Link } from 'react-router-dom'

const AdmissionStatistics: React.FC = () => {
  const { classes } = useStyles()
  const isMobile = useIsMobile()
  const { data, loading, error } = useQuery<InterviewStatisticsReturns>(
    INTERVIEW_STATISTICS_QUERY
  )

  if (error) return <FullPageError />

  if (loading || !data) return <FullContentLoader />

  const {
    interviewStatistics: {
      totalApplicants,
      totalAvailableInterviews,
      totalBookedInterviews,
      totalFinishedInterviews,
      userInterviewCounts,
    },
  } = data

  return (
    <Stack>
      <Breadcrumbs
        items={[
          { label: 'Hjem', path: '/dashboard' },
          { label: 'Orvik', path: '/admissions' },
          { label: 'Statistikk', path: '' },
        ]}
      />
      <Title>Statistikk</Title>
      <SimpleGrid cols={isMobile ? 2 : 4}>
        <Card>
          <Title order={4}>Antall søkere</Title>
          <Text className={classes.statisticNumber}>{totalApplicants}</Text>
        </Card>
        <Card>
          <Title order={4}>Ledige intervjuer</Title>
          <Text className={classes.statisticNumber}>
            {totalAvailableInterviews}
          </Text>
        </Card>
        <Card>
          <Title order={4}>Bookede intervjuer</Title>
          <Text className={classes.statisticNumber}>
            {totalBookedInterviews}
          </Text>
        </Card>
        <Card>
          <Title order={4}>Fullførte intervjuer</Title>
          <Text className={classes.statisticNumber}>
            {totalFinishedInterviews}
          </Text>
        </Card>
      </SimpleGrid>
      <Title order={2}>MVP's</Title>
      <CardTable highlightOnHover>
        <thead>
          <tr>
            <th>Plass</th>
            <th>Navn</th>
            <th style={{ textAlign: 'right' }}>Antall intervjuer</th>
          </tr>
        </thead>
        <tbody>
          {userInterviewCounts.map(({ user, interviewCount }, index) => (
            <tr key={user.id}>
              <td>{index + 1}</td>
              <td>
                <Link to={`/users/${user.id}`}>{user.getFullWithNickName}</Link>
              </td>
              <td style={{ textAlign: 'right' }}>{interviewCount}</td>
            </tr>
          ))}
        </tbody>
      </CardTable>
    </Stack>
  )
}

const useStyles = createStyles(theme => ({
  statisticNumber: {
    fontSize: '32px',
    fontWeight: 700,
    color: 'hotpink',
  },
}))

export default AdmissionStatistics
