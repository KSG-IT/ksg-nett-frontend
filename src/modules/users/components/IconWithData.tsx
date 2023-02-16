import { Anchor, Grid, Stack, Text, ThemeIcon } from '@mantine/core'
import { TablerIcon } from '@tabler/icons'

interface IconWithDataProps {
  icon: TablerIcon
  userData: string
  type?: 'text' | 'email' | 'tel'
}

export const IconWithData: React.FC<IconWithDataProps> = ({
  icon: Icon,
  userData,
  type = 'text',
}) => {
  function renderValueField() {
    if (type === 'email') {
      return (
        <Anchor size="sm" color="dimmed" href={`mailto:${userData}`}>
          {userData}
        </Anchor>
      )
    } else if (type === 'tel') {
      return (
        <Anchor size="sm" color="dimmed" href={`tel:${userData}`}>
          {userData}
        </Anchor>
      )
    } else {
      return (
        <Text size="sm" color={'dimmed'}>
          {userData}
        </Text>
      )
    }
  }

  return (
    <Grid align={'center'} columns={12}>
      <Grid.Col span={1}>
        <Stack align={'center'}>
          <ThemeIcon variant="light">
            <Icon size={14} stroke={1.5} />
          </ThemeIcon>
        </Stack>
      </Grid.Col>
      <Grid.Col span={10}>{renderValueField()}</Grid.Col>
    </Grid>
  )
}
