import { Dispatch } from 'react'
import { GameAction, GameState, MIN_PLAYERS } from '../../game'
import { AddPlayerInput, LobbyPlayers } from '../Lobby'
import classes from './Game.module.css'

interface PlayersPanelProps {
  state: GameState
  dispatch: Dispatch<GameAction>
  onClose: () => void
}

// Add or remove players without leaving the game. A new player comes last
// in the round.
export const PlayersPanel: React.FC<PlayersPanelProps> = ({
  state,
  dispatch,
  onClose,
}) => {
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') onClose()
  }

  // Too few players ends the game, so the panel closes with it.
  const handleRemove = (playerId: string) => {
    if (state.players.length - 1 < MIN_PLAYERS) onClose()
    dispatch({ type: 'removePlayer', playerId })
  }

  return (
    <div
      className={classes.playersPanel}
      role="dialog"
      aria-modal="true"
      aria-label="Spillere"
      onKeyDown={handleKeyDown}
    >
      <div className={classes.playersPanelBody}>
        <div className={classes.playersPanelHeader}>
          <h2 className={classes.playersPanelTitle}>
            Spillere · {state.players.length}
          </h2>
          <button type="button" className={classes.primary} onClick={onClose}>
            Ferdig
          </button>
        </div>
        <AddPlayerInput
          onAdd={player => dispatch({ type: 'addPlayer', player })}
        />
        <p className={classes.muted}>
          Nye spillere kommer sist i runden. Med færre enn 2 spillere går
          spillet tilbake til lobbyen.
        </p>
        <LobbyPlayers players={state.players} onRemove={handleRemove} />
      </div>
    </div>
  )
}
