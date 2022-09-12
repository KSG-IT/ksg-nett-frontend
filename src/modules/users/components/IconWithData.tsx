import { IconName } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Grid, Stack, Text } from '@mantine/core'

interface IconWithDataProps {
  icon: IconName
  userData: string
}

export const IconWithData: React.FC<IconWithDataProps> = ({
  icon,
  userData,
}) => {
  return (
    <Grid align={'center'} columns={12}>
      <Grid.Col span={1}>
        <Stack align={'center'}>
          <FontAwesomeIcon icon={icon} style={{ color: 'darkgoldenrod' }} />
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
