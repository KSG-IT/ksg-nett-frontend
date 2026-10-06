import { IconTrash } from '@tabler/icons-react'
import { useState } from 'react'
import classes from './Lobby.module.css'

interface ResetButtonProps {
  onReset: () => void
}

// Removes all players, settings and the saved game, but keeps the card
// edits. A second click confirms.
export const ResetButton: React.FC<ResetButtonProps> = ({ onReset }) => {
  const [confirming, setConfirming] = useState(false)

  const handleConfirm = () => {
    setConfirming(false)
    onReset()
  }

  if (!confirming) {
    return (
      <button
        type="button"
        className={classes.reset}
        onClick={() => setConfirming(true)}
      >
        <IconTrash size="1em" /> Nullstill alt
      </button>
    )
  }

  return (
    <span className={classes.resetConfirm}>
      Fjerne alle spillere og innstillinger? Kortene beholdes.
      <button
        type="button"
        className={classes.reset}
        data-danger
        onClick={handleConfirm}
      >
        Ja, nullstill
      </button>
      <button
        type="button"
        className={classes.reset}
        onClick={() => setConfirming(false)}
      >
        Avbryt
      </button>
    </span>
  )
}
