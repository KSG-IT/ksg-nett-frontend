import { IconBeer } from '@tabler/icons-react'
import classes from './TodSearchOption.module.css'

// The hidden result in the header search. Only a matching search shows it.
export const TodSearchOption: React.FC = () => (
  <div className={classes.option}>
    <span className={classes.bubble} data-n="1" />
    <span className={classes.bubble} data-n="2" />
    <span className={classes.bubble} data-n="3" />
    <span className={classes.bubble} data-n="4" />
    <span className={classes.icon}>
      <IconBeer size={22} stroke={1.8} />
    </span>
    <span className={classes.text}>
      <span className={classes.title}>Truth or Drink</span>
      <span className={classes.subtitle}>Oi. Her fant du noe spennende</span>
    </span>
    <kbd className={classes.key}>Enter</kbd>
  </div>
)
