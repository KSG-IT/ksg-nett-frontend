import classes from './Lobby.module.css'

interface SwitchRowProps {
  name: string
  hint: string
  checked: boolean
  color: string
  onToggle: () => void
}

export const SwitchRow: React.FC<SwitchRowProps> = ({
  name,
  hint,
  checked,
  color,
  onToggle,
}) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    className={classes.pack}
    data-color={color}
    onClick={onToggle}
  >
    <span className={classes.packDot} />
    <span className={classes.packText}>
      <span className={classes.packName}>{name}</span>
      <span className={classes.packHint}>{hint}</span>
    </span>
    <span className={classes.switch} />
  </button>
)
