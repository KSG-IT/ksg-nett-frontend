import classes from './Game.module.css'

interface EndGameConfirmProps {
  onEnd: () => void
  onCancel: () => void
}

// The X is easy to hit by mistake on a phone, so ending the game asks first.
export const EndGameConfirm: React.FC<EndGameConfirmProps> = ({
  onEnd,
  onCancel,
}) => {
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') onCancel()
  }

  return (
    <div
      className={classes.overlay}
      role="alertdialog"
      aria-modal="true"
      aria-label="Avslutte spillet?"
      onKeyDown={handleKeyDown}
    >
      <span className={classes.overlayLabel}>Avslutte spillet?</span>
      <p className={classes.overlayHint}>
        Dere går tilbake til lobbyen. Spillerne og innstillingene beholdes, men
        drikketallene starter på null igjen.
      </p>
      <div className={classes.verdictRow}>
        <button
          type="button"
          className={classes.overlayButton}
          onClick={onCancel}
          autoFocus
        >
          Fortsett å spille
        </button>
        <button
          type="button"
          className={classes.overlayButton}
          data-verdict="failed"
          onClick={onEnd}
        >
          Avslutt
        </button>
      </div>
    </div>
  )
}
