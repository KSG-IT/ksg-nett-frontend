import { playerColor } from '../../display'
import { GameState } from '../../game'
import { PlayerAvatar } from '../PlayerAvatar'
import classes from './Game.module.css'

interface VirusRailProps {
  state: GameState
}

export const VirusRail: React.FC<VirusRailProps> = ({ state }) => {
  const { virus } = state
  const index = virus
    ? state.players.findIndex(player => player.id === virus.playerId)
    : -1
  const infected = index === -1 ? null : state.players[index]

  return (
    <aside className={classes.rail} data-side="left">
      <h2 className={classes.railHeading} data-kind="virus">
        Virus
      </h2>
      {virus && infected ? (
        <div className={classes.panel}>
          <span className={classes.panelPlayer}>
            <PlayerAvatar
              player={infected}
              color={playerColor(index)}
              size="sm"
            />
            {infected.name}
          </span>
          <span>{virus.card.text}</span>
        </div>
      ) : (
        <p className={classes.muted}>Ingen er smittet ennå.</p>
      )}
    </aside>
  )
}
