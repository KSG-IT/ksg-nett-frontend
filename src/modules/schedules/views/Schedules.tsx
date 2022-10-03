import { useQuery } from '@apollo/client'
import { Button, createStyles, Group, Title } from '@mantine/core'
import { FullPageError } from 'components/FullPageComponents'
import { FullContentLoader } from 'components/Loading'
import { Link } from 'react-router-dom'
import { SchedulesTable } from '../components/Schedules'
import { ALL_SCHEDULES } from '../queries'
import { AllSchedulesReturns } from '../types.graphql'

const useSchedulesStyles = createStyles(theme => ({
  wrapper: {
    display: 'flex',
    width: '100%',
    flexDirection: 'column',
  },
}))

export const Schedules: React.FC = () => {
  const { classes } = useSchedulesStyles()
  const { data, loading, error } = useQuery<AllSchedulesReturns>(ALL_SCHEDULES)

  if (error) return <FullPageError />

  if (loading || !data) return <FullContentLoader />

  const { allSchedules } = data

  return (
    <div className={classes.wrapper}>
      <Group>
        <Title>Vaktplaner</Title>
        <Link to="/schedules/templates">
          <Button>Vaktplanmaler</Button>
        </Link>
      </Group>
      <SchedulesTable schedules={allSchedules} />
    </div>
  )
}
