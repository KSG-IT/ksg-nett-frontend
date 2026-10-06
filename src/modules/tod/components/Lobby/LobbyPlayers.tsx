import { IconX } from '@tabler/icons-react'
import { playerColor } from '../../display'
import { Player } from '../../game'
import { playerSubtitle } from '../../players'
import { PlayerAvatar } from '../PlayerAvatar'
import classes from './Lobby.module.css'

interface LobbyPlayersProps {
  players: Player[]
  onRemove: (playerId: string) => void
}

export const LobbyPlayers: React.FC<LobbyPlayersProps> = ({
  players,
  onRemove,
}) => (
  <ul className={classes.playerGrid}>
    {players.map((player, index) => (
      <li key={player.id} className={classes.playerCard}>
        <PlayerAvatar player={player} color={playerColor(index)} size="lg" />
        <span className={classes.playerText}>
          <span className={classes.playerName}>{player.name}</span>
          <span className={classes.playerGroup}>{playerSubtitle(player)}</span>
        </span>
        <button
          type="button"
          className={classes.remove}
          aria-label={`Fjern ${player.name}`}
          onClick={() => onRemove(player.id)}
        >
          <IconX size="1em" />
        </button>
      </li>
    ))}
  </ul>
)
