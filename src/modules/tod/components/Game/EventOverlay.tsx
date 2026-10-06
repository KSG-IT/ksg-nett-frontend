import { Dispatch } from 'react'
import { firstName } from '../../display'
import { GameAction, GameEvent, GameState, playerById } from '../../game'
import classes from './Game.module.css'
import { MissionReveal } from './MissionReveal'
import { MissionVerdict } from './MissionVerdict'

interface EventOverlayProps {
  event: GameEvent
  state: GameState
  dispatch: Dispatch<GameAction>
}

// A full-screen moment for a new virus, rule or mission. The card then moves
// to its side rail.
export const EventOverlay: React.FC<EventOverlayProps> = ({
  event,
  state,
  dispatch,
}) => {
  const onDismiss = () => dispatch({ type: 'dismissEvent' })

  if (event.type === 'missionReveal') {
    return (
      <MissionVerdict
        state={state}
        missionId={event.missionId}
        due={event.due}
        dispatch={dispatch}
      />
    )
  }

  if (event.type === 'mission') {
    const player = playerById(state, event.assignment.playerId)
    return (
      <MissionReveal
        name={player ? firstName(player.name) : 'Noen'}
        card={event.assignment.card}
        onDone={onDismiss}
      />
    )
  }

  if (event.type === 'reshuffled') {
    return (
      <EventFrame kind="rule" headline="Stokket!" onDismiss={onDismiss}>
        Alle kortene er brukt. Kortstokken er stokket på nytt.
      </EventFrame>
    )
  }

  if (event.type === 'virus') {
    const player = playerById(state, event.assignment.playerId)
    return (
      <EventFrame kind="virus" headline="Virus!" onDismiss={onDismiss}>
        <span className={classes.overlayWho}>
          {player ? firstName(player.name) : 'Noen'} er smittet
        </span>
        {event.assignment.card.text}
      </EventFrame>
    )
  }

  return (
    <EventFrame kind="rule" headline="Ny regel" onDismiss={onDismiss}>
      <span className={classes.overlayWho}>{event.card.title}</span>
      {event.card.text}
    </EventFrame>
  )
}

interface EventFrameProps {
  kind: 'virus' | 'rule'
  headline: string
  onDismiss: () => void
  children: React.ReactNode
}

const EventFrame: React.FC<EventFrameProps> = ({
  kind,
  headline,
  onDismiss,
  children,
}) => (
  <div
    className={classes.overlay}
    data-kind={kind}
    role="dialog"
    aria-modal="true"
    aria-label={headline}
  >
    <span className={classes.overlayHeadline}>{headline}</span>
    <p className={classes.overlayText}>{children}</p>
    <button
      type="button"
      className={classes.overlayButton}
      onClick={onDismiss}
      autoFocus
    >
      Videre
    </button>
  </div>
)
