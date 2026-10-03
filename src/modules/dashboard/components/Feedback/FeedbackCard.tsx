import { Text, UnstyledButton } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { IconMessageHeart } from '@tabler/icons-react'
import classes from './FeedbackCard.module.css'
import { FeedbackModal } from './FeedbackModal'

// A shortcut card that opens the feedback form instead of a page.
export const FeedbackCard: React.FC = () => {
  const [opened, { open, close }] = useDisclosure(false)
  return (
    <>
      <UnstyledButton className={classes.card} onClick={open}>
        <IconMessageHeart className={classes.icon} size={32} />
        <Text size="md" fw={800} className={classes.title}>
          Gi tilbakemelding
        </Text>
        <span className={classes.badge} aria-hidden>
          Si ifra!
        </span>
      </UnstyledButton>
      <FeedbackModal opened={opened} onClose={close} />
    </>
  )
}
