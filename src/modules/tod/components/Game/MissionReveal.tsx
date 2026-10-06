import { IconEye, IconEyeOff } from '@tabler/icons-react'
import { useState } from 'react'
import { DrawnCard } from '../../game'
import classes from './Game.module.css'

interface MissionRevealProps {
  name: string
  card: DrawnCard
  onDone: () => void
}

// The TV shows only the name. The player taps the button to read the
// mission and taps it again to hide it, so the others do not see it.
export const MissionReveal: React.FC<MissionRevealProps> = ({
  name,
  card,
  onDone,
}) => {
  const [revealed, setRevealed] = useState(false)

  return (
    <div
      className={classes.overlay}
      data-kind="mission"
      role="dialog"
      aria-modal="true"
      aria-label="Hemmelig oppdrag"
    >
      <span className={classes.overlayLabel}>Hemmelig oppdrag</span>
      <span className={classes.overlayHeadline}>{name}</span>
      {revealed ? (
        <p className={classes.missionText}>
          {card.title && <strong>{card.title}: </strong>}
          {card.text}
        </p>
      ) : (
        <p className={classes.overlayHint}>
          Alle andre ser bort. {name} trykker på knappen.
        </p>
      )}
      <button
        type="button"
        className={classes.holdButton}
        aria-pressed={revealed}
        onClick={() => setRevealed(revealed => !revealed)}
      >
        {revealed ? <IconEyeOff size="1.2em" /> : <IconEye size="1.2em" />}
        {revealed ? 'Trykk for å skjule' : 'Trykk for å se'}
      </button>
      <button type="button" className={classes.textButton} onClick={onDone}>
        Jeg har lest det
      </button>
    </div>
  )
}
