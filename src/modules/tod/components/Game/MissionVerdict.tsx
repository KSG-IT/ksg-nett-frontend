import { Dispatch } from 'react'
import { firstName, PENALTY_LABELS } from '../../display'
import { GameAction, GameState, missionById, playerById } from '../../game'
import classes from './Game.module.css'

interface MissionVerdictProps {
  state: GameState
  missionId: number
  due: boolean
  dispatch: Dispatch<GameAction>
}

// The mission is shown to everyone, and the table decides if the player
// completed it. A deadline that runs out opens this without a way back.
export const MissionVerdict: React.FC<MissionVerdictProps> = ({
  state,
  missionId,
  due,
  dispatch,
}) => {
  const mission = missionById(state, missionId)
  if (!mission) return null
  const player = playerById(state, mission.playerId)
  const name = player ? firstName(player.name) : 'Noen'
  const judge = (completed: boolean) =>
    dispatch({ type: 'judgeMission', missionId, completed })

  return (
    <div
      className={classes.overlay}
      data-kind="mission"
      role="dialog"
      aria-modal="true"
      aria-label="Oppdrag avslørt"
    >
      <span className={classes.overlayLabel}>
        {due ? 'Tiden er ute' : 'Oppdrag avslørt'}
      </span>
      <span className={classes.overlayHeadline}>{name}</span>
      <p className={classes.missionText}>
        {mission.card.title && <strong>{mission.card.title}: </strong>}
        {mission.card.text}
      </p>
      <p className={classes.overlayHint}>Klarte {name} oppdraget?</p>
      <div className={classes.verdictRow}>
        <button
          type="button"
          className={classes.overlayButton}
          onClick={() => judge(true)}
        >
          Fullført
        </button>
        <button
          type="button"
          className={classes.overlayButton}
          data-verdict="failed"
          onClick={() => judge(false)}
        >
          Ikke fullført · {PENALTY_LABELS[state.settings.penalty]}
        </button>
      </div>
      {!due && (
        <button
          type="button"
          className={classes.textButton}
          onClick={() => dispatch({ type: 'dismissEvent' })}
        >
          Tilbake
        </button>
      )}
    </div>
  )
}
