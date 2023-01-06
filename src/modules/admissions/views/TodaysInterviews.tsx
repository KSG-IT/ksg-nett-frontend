import { gql, useQuery } from '@apollo/client'
import { Stack, Title } from '@mantine/core'
import { Breadcrumbs } from 'components/Breadcrumbs'
import { CardTable } from 'components/CardTable'
import { FullPageError } from 'components/FullPageComponents'
import { FullContentLoader } from 'components/Loading'
import { format } from 'util/date-fns'

const TODAYS_APPLICANTS = gql`
  query TodaysApplicants {
    todaysApplicants {
      id
      fullName
      interview {
        id
        interviewStart
        location {
          id
          name
        }
      }
    }
  }
`

const breadcrumbsItems = [
  { label: 'Hjem', path: '/dashboard' },
  { label: 'Orvik', path: '/admissions' },
  { label: 'Dagens intervjuer', path: '' },
]
export const TodaysInterviews: React.FC = () => {
  const { data, loading, error } = useQuery(TODAYS_APPLICANTS, {
    fetchPolicy: 'network-only',
  })

  if (error) return <FullPageError />

  if (loading || !data) return <FullContentLoader />

  const rows = data.todaysApplicants.map((applicant: any) => (
    <tr>
      <td>{applicant.fullName}</td>
      <td>{format(new Date(applicant.interview.interviewStart), 'HH:mm')}</td>
      <td>{applicant.interview.location.name}</td>
      <td></td>
    </tr>
  ))

  return (
    <Stack>
      <Breadcrumbs items={breadcrumbsItems} />
      <Title>Dagens intervjuer</Title>
      <CardTable>
        <thead>
          <tr>
            <th>Navn</th>
            <th>Intervjutid</th>
            <th>Intervjulokale</th>
            <th></th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </CardTable>
    </Stack>
  )
}
