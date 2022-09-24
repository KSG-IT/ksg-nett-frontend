import { IconName } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Grid, Stack, Text, ThemeIcon } from '@mantine/core'
import { IconVideo, TablerIcon } from '@tabler/icons'

interface IconWithDataProps {
  icon: TablerIcon
  userData: string
}

export function IconWithData({ icon: Icon, userData }: IconWithDataProps) {
  return (
    <Grid align={'center'} columns={12}>
      <Grid.Col span={1}>
        <Stack align={'center'}>
          <ThemeIcon variant="light" color={'orange'}>
            <Icon size={14} stroke={1.5} />
          </ThemeIcon>
        </Stack>
      </Grid.Col>
      <Grid.Col span={10}>
        <Text size="sm" color={'dimmed'}>
          {userData}
        </Text>
      </Grid.Col>
    </Grid>
  )
}
