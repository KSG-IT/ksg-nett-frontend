import { Dispatch } from 'react'
import { KIND_LABELS, PENALTY_LABELS, playerColor } from '../../display'
import { GameAction, GameState, Player } from '../../game'
import { playerSubtitle } from '../../players'
import { PlayerAvatar } from '../PlayerAvatar'
import classes from './Game.module.css'

// Long cards get a smaller font, so they fit without scrolling.
const LONG_CARD_LENGTH = 110

interface CurrentTurnProps {
  state: GameState
  player: Player
  dispatch: Dispatch<GameAction>
}

export const CurrentTurn: React.FC<CurrentTurnProps> = ({
  state,
  player,
  dispatch,
}) => {
  const { card } = state

  return (
    <main className={classes.turn}>
      <div className={classes.turnPlayer}>
        <PlayerAvatar
          player={player}
          color={playerColor(state.current)}
          size="xl"
        />
        <span className={classes.turnPlayerText}>
          <span className={classes.turnName}>{player.name}</span>
          <span className={classes.muted}>{playerSubtitle(player)}</span>
        </span>
      </div>

      <article
        key={state.turn}
        className={classes.card}
        data-kind={card?.kind}
        data-length={
          card && card.text.length > LONG_CARD_LENGTH ? 'long' : 'normal'
        }
      >
        {card ? (
          <>
            <span className={classes.cardLabel}>{KIND_LABELS[card.kind]}</span>
            <p className={classes.cardText}>{card.text}</p>
          </>
        ) : (
          <p className={classes.cardText}>
            Ingen kort passer. Legg til flere spillere, eller skru på flere
            kortstokker.
          </p>
        )}
      </article>

      <div className={classes.actions}>
        {state.settings.jokers && (
          <button
            type="button"
            className={classes.secondary}
            disabled={player.jokers === 0}
            onClick={() => dispatch({ type: 'joker' })}
          >
            Hopp over gratis ({player.jokers} igjen)
          </button>
        )}
        <button
          type="button"
          className={classes.drink}
          onClick={() => dispatch({ type: 'drink' })}
        >
          {PENALTY_LABELS[state.settings.penalty]}
        </button>
        <button
          type="button"
          className={classes.primary}
          onClick={() => dispatch({ type: 'next' })}
        >
          Neste
        </button>
      </div>
    </main>
  )
}
