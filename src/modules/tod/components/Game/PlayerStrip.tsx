import { firstName, playerColor } from '../../display'
import { GameState } from '../../game'
import { PlayerAvatar } from '../PlayerAvatar'
import classes from './Game.module.css'

interface PlayerStripProps {
  state: GameState
}

export const PlayerStrip: React.FC<PlayerStripProps> = ({ state }) => (
  <footer className={classes.strip}>
    {state.players.map((player, index) => (
      <div
        key={player.id}
        className={classes.chip}
        data-current={index === state.current}
      >
        <PlayerAvatar player={player} color={playerColor(index)} size="sm" />
        <span>{firstName(player.name)}</span>
        <span className={classes.chipDrinks} aria-label="Straffer">
          {player.drinks}
        </span>
      </div>
    ))}
  </footer>
)
