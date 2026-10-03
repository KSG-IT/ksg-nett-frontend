import { Button, ButtonProps } from '@mantine/core'
import { Link } from 'react-router-dom'
import classes from './V2Button.module.css'

interface V2ButtonProps extends Pick<ButtonProps, 'size'> {
  scheduleId: string
  label: string
}

// The way into the new schedule view while the old one still exists. The
// badge sits on the top right corner, like a notification.
export const V2Button: React.FC<V2ButtonProps> = ({
  scheduleId,
  label,
  size,
}) => (
  <span className={classes.wrapper}>
    <Button
      component={Link}
      to={`/schedules/${scheduleId}/v2`}
      color="samfundet-red"
      size={size}
    >
      {label}
    </Button>
    <span className={classes.badge} aria-hidden>
      Nytt design!
    </span>
  </span>
)
