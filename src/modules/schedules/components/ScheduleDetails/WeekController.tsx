import { Container, Group, Text, UnstyledButton } from '@mantine/core'
import { createStyles } from '@mantine/emotion'
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react'
import { format } from 'util/date-fns'

interface WeekController {
  week: Date
  previousWeekCallback: () => void
  nextWeekCallback: () => void
}

export const WeekController: React.FC<WeekController> = ({
  week,
  previousWeekCallback,
  nextWeekCallback,
}) => {
  const { classes } = useWeekControllerStyles()
  return (
    <Group className={classes.weekController} spacing={0} align={'center'}>
      <UnstyledButton
        className={classes.weekControllerButton}
        onClick={previousWeekCallback}
      >
        <IconChevronLeft />
      </UnstyledButton>
      <Container>
        <Text>Uke {format(week, 'w')}</Text>
      </Container>
      <UnstyledButton
        className={classes.weekControllerButton}
        onClick={nextWeekCallback}
      >
        <IconChevronRight />
      </UnstyledButton>
    </Group>
  )
}

const useWeekControllerStyles = createStyles(theme => ({
  weekController: {
    backgroundColor: 'white',
    border: '1px solid gray',
    borderRadius: '5px',
    'button:first-of-type': {
      borderRight: '1px solid gray',
    },
    'button:last-of-type': {
      borderLeft: '1px solid gray',
    },
  },
  weekControllerButton: {
    ':hover': {
      cursor: 'pointer',
    },
  },
}))
