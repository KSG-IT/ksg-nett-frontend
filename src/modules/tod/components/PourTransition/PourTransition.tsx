import classes from './PourTransition.module.css'

// Length of one pour, in ms. The route shows the game after this time.
export const POUR_DURATION = 1900

// A glass fills and the screen says "Skål!". It plays on entry from the
// search and hides the time it takes to load the game.
export const PourTransition: React.FC = () => (
  <div className={classes.root} role="status" aria-label="Skjenker opp">
    <span className={classes.stream} />
    <div className={classes.glass}>
      <div className={classes.fill}>
        <div className={classes.foam} />
        <span className={classes.bubble} data-n="1" />
        <span className={classes.bubble} data-n="2" />
        <span className={classes.bubble} data-n="3" />
        <span className={classes.bubble} data-n="4" />
      </div>
    </div>
    <div className={classes.caption}>
      <span className={classes.pouring}>Skjenker opp …</span>
      <span className={classes.cheers}>Skål!</span>
    </div>
  </div>
)
