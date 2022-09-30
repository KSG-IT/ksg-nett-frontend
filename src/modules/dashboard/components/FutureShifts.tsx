import { Card, createStyles, Grid, Stack, Text } from '@mantine/core'
import { UserNode } from 'modules/users/types'

type MockShiftNode = {
  user: Pick<UserNode, 'id' | 'firstName'>
  slot: {
    start: string
    end: string
    type: {
      name: string
    }
    group: {
      name: string
    }
  }
}

interface ShiftProps {
  shifts: MockShiftNode[]
}

const useStyles = createStyles(theme => ({
  card: {
    backgroundColor: theme.colors.white,
    borderTop: `4px solid ${theme.colors.brand}`,
  },
}))

export const FutureShifts: React.FC<ShiftProps> = ({ shifts }) => {
  const { classes } = useStyles()
  const shiftCards = shifts.map((shift, index) => (
    <>
      <Grid.Col px={0} span={4}>
        <Text weight={'lighter'} color={'slategray'}>
          Tidspunkt
        </Text>
      </Grid.Col>
      <Grid.Col px={0} span={4}>
        <Text weight={'lighter'} color={'violet'}>
          Type
        </Text>
      </Grid.Col>
      <Grid.Col p={0} span={4}>
        <Text>
          {shift.slot.start} - {shift.slot.end}
        </Text>
      </Grid.Col>
      <Grid.Col p={0} span={4}>
        <Text>{shift.slot.type.name}</Text>
      </Grid.Col>
    </>
  ))
  return (
    <Stack>
      <Text color={'dimmed'} weight={700} p={'xs'}>
        Neste vakter
      </Text>
      <Card withBorder pt={'lg'} radius={'md'} className={classes.card}>
        <Grid columns={8} p={'xs'} pl={'md'}>
          {shiftCards}
        </Grid>
      </Card>
    </Stack>
  )
}
