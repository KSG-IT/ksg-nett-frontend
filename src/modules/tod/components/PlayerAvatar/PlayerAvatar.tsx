import { Player } from '../../game'
import classes from './PlayerAvatar.module.css'

interface PlayerAvatarProps {
  player: Player
  color: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

export const PlayerAvatar: React.FC<PlayerAvatarProps> = ({
  player,
  color,
  size = 'md',
}) => (
  <span className={classes.avatar} data-color={color} data-size={size}>
    {player.profileImage ? (
      <img className={classes.image} src={player.profileImage} alt="" />
    ) : (
      player.initials
    )}
  </span>
)
