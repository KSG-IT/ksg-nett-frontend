import classes from './OnlineDot.module.css'

interface OnlineDotProps {
  online: boolean
}

// The text is for screen readers, so the state is not only a colour.
export const OnlineDot: React.FC<OnlineDotProps> = ({ online }) => (
  <span className={classes.dot} data-online={online || undefined}>
    <span className={classes.label}>
      {online ? 'Pålogget' : 'Ikke pålogget'}
    </span>
  </span>
)
