import { useQuery } from '@apollo/client'
import { Button, Group, Title } from '@mantine/core'
import { FullPageError } from 'components/FullPageComponents'
import { FullContentLoader } from 'components/Loading'
import { ScheduleTemplateTable } from '../components/ScheduleTemplates/ScheduleTemplateTable'
import { ALL_SCHEDULE_TEMPLATES } from '../queries'
import { AllScheduleTemplatesReturns } from '../types.graphql'
import { createStyles } from '@mantine/core'
import { IconPlus } from '@tabler/icons'

export const ScheduleTemplates: React.FC = () => {
  const { classes } = useScheduleTemplateStyles()
  const { data, loading, error } = useQuery<AllScheduleTemplatesReturns>(
    ALL_SCHEDULE_TEMPLATES
  )

  if (error) return <FullPageError />

  if (loading || !data) return <FullContentLoader />

  const { allScheduleTemplates } = data

  return (
    <div className={classes.wrapper}>
      <Group position="apart" my="md">
        <Title>Vaktplan maler</Title>
        <Button leftIcon={<IconPlus />}>Opprett ny mal</Button>
      </Group>
      <ScheduleTemplateTable scheduleTemplates={allScheduleTemplates} />
    </div>
  )
}

const useScheduleTemplateStyles = createStyles(theme => ({
  wrapper: {},
}))
