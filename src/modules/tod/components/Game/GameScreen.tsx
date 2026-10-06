import { Dispatch } from 'react'
import { currentPlayer, GameAction, GameState } from '../../game'
import { CurrentTurn } from './CurrentTurn'
import { EndGameConfirm } from './EndGameConfirm'
import { EventOverlay } from './EventOverlay'
import classes from './Game.module.css'
import { GameHeader } from './GameHeader'
import { PlayersPanel } from './PlayersPanel'
import { PlayerStrip } from './PlayerStrip'
import { RuleRail } from './RuleRail'
import { VirusRail } from './VirusRail'

interface GameScreenProps {
  state: GameState
  dispatch: Dispatch<GameAction>
  editingPlayers: boolean
  onEditPlayers: (editing: boolean) => void
  confirmingEnd: boolean
  onConfirmEnd: (confirming: boolean) => void
  onToggleFullscreen: () => void
}

export const GameScreen: React.FC<GameScreenProps> = ({
  state,
  dispatch,
  editingPlayers,
  onEditPlayers,
  confirmingEnd,
  onConfirmEnd,
  onToggleFullscreen,
}) => {
  const handleEnd = () => {
    onConfirmEnd(false)
    if (document.fullscreenElement)
      document.exitFullscreen().catch(() => undefined)
    dispatch({ type: 'endGame' })
  }

  const player = currentPlayer(state)
  const event = state.events[0] ?? null
  if (!player) return null

  return (
    <div className={classes.game}>
      <GameHeader
        state={state}
        onEnd={() => onConfirmEnd(true)}
        onEditPlayers={() => onEditPlayers(true)}
        onToggleFullscreen={onToggleFullscreen}
      />
      <VirusRail state={state} />
      <CurrentTurn state={state} player={player} dispatch={dispatch} />
      <RuleRail state={state} dispatch={dispatch} />
      <PlayerStrip state={state} />
      {editingPlayers && (
        <PlayersPanel
          state={state}
          dispatch={dispatch}
          onClose={() => onEditPlayers(false)}
        />
      )}
      {confirmingEnd && (
        <EndGameConfirm
          onEnd={handleEnd}
          onCancel={() => onConfirmEnd(false)}
        />
      )}
      {!editingPlayers && !confirmingEnd && event && (
        <EventOverlay event={event} state={state} dispatch={dispatch} />
      )}
    </div>
  )
}
