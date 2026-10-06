import { Dispatch } from 'react'
import { GameAction, GameState } from '../../game'
import classes from './Game.module.css'
import { MissionList } from './MissionList'

interface RuleRailProps {
  state: GameState
  dispatch: Dispatch<GameAction>
}

export const RuleRail: React.FC<RuleRailProps> = ({ state, dispatch }) => (
  <aside className={classes.rail} data-side="right">
    <h2 className={classes.railHeading} data-kind="rule">
      Regel
    </h2>
    {state.rule ? (
      <div className={classes.panel}>
        <span className={classes.panelTitle}>{state.rule.title}</span>
        <span>{state.rule.text}</span>
      </div>
    ) : (
      <p className={classes.muted}>Ingen regel ennå.</p>
    )}
    {state.missions.length > 0 && (
      <MissionList state={state} dispatch={dispatch} />
    )}
  </aside>
)
