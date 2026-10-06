import { IconDeviceMobileRotated } from '@tabler/icons-react'
import { useState } from 'react'
import classes from './PortraitHint.module.css'

// On a phone in portrait, ask the player to turn the phone.
export const PortraitHint: React.FC = () => {
  const [dismissed, setDismissed] = useState(false)
  if (dismissed) return null

  return (
    <div className={classes.hint}>
      <IconDeviceMobileRotated size="3em" stroke={1.5} />
      <p className={classes.text}>Snu telefonen</p>
      <button
        type="button"
        className={classes.button}
        onClick={() => setDismissed(true)}
      >
        Spill likevel
      </button>
    </div>
  )
}
