import {
  Container,
  createStyles,
  Group,
  Text,
  UnstyledButton,
} from '@mantine/core'
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react'
import { format } from 'util/date-fns'

interface WeekController {
  value: Date
  onPrevious: () => void
  onNext: () => void
  label?: string
}

export const WeekController: React.FC<WeekController> = ({
  value,
  onPrevious,
  onNext,
  label,
}) => {
  const { classes } = useWeekControllerStyles()
  return (
    <Group className={classes.weekController} spacing={0} align={'center'}>
      <UnstyledButton
        className={classes.weekControllerButton}
        onClick={onPrevious}
      >
        <IconChevronLeft />
      </UnstyledButton>
      <Container>
        <Text>{label ?? `Uke ${format(value, 'w')}`}</Text>
      </Container>
      <UnstyledButton className={classes.weekControllerButton} onClick={onNext}>
        <IconChevronRight />
      </UnstyledButton>
    </Group>
  )
}

const useWeekControllerStyles = createStyles(theme => ({
  weekController: {
    backgroundColor:
      theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
    border: `1px solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]
    }`,
    borderRadius: '5px',
    'button:first-of-type': {
      borderRight: `1px solid ${
        theme.colorScheme === 'dark'
          ? theme.colors.dark[4]
          : theme.colors.gray[3]
      }`,
    },
    'button:last-of-type': {
      borderLeft: `1px solid ${
        theme.colorScheme === 'dark'
          ? theme.colors.dark[4]
          : theme.colors.gray[3]
      }`,
    },
  },
  weekControllerButton: {
    ':hover': {
      cursor: 'pointer',
    },
  },
}))
