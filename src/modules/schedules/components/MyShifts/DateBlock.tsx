import { format } from 'util/date-fns'
import classes from './DateBlock.module.css'

interface DateBlockProps {
  date: Date
  variant?: 'accent' | 'soft'
  showMonth?: boolean
  size?: number
}

export const DateBlock: React.FC<DateBlockProps> = ({
  date,
  variant = 'soft',
  showMonth = false,
  size = 48,
}) => (
  <div
    className={classes.block}
    data-variant={variant}
    style={{ width: size, minHeight: size }}
  >
    <span className={classes.weekday}>{format(date, 'EEE')}</span>
    <span className={classes.day} style={{ fontSize: size * 0.42 }}>
      {format(date, 'd')}
    </span>
    {showMonth && <span className={classes.month}>{format(date, 'MMM')}</span>}
  </div>
)
