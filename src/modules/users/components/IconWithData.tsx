import { IconName } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Grid, Stack, Text } from '@mantine/core'
import { TablerIcon } from '@tabler/icons'

interface IconWithDataProps {
  icon: TablerIcon
  userData: string
}

export const IconWithData: React.FC<IconWithDataProps> = props => {
  return (
    <Grid align={'center'} columns={12}>
      <Grid.Col span={1}>
        <Stack align={'center'}>
          <props.icon />
        </Stack>
      </Grid.Col>
      <Grid.Col span={10}>
        <Text size="sm" color={'dimmed'}>
          {props.userData}
        </Text>
      </Grid.Col>
    </Grid>
  )
}
