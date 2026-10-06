import { IconMaximize, IconUsers, IconX } from '@tabler/icons-react'
import { GameState } from '../../game'
import classes from './Game.module.css'

interface GameHeaderProps {
  state: GameState
  onEnd: () => void
  onEditPlayers: () => void
  onToggleFullscreen: () => void
}

const KEY_HINTS = [
  { key: 'Mellomrom', action: 'neste', joker: false },
  { key: 'D', action: 'drikk', joker: false },
  { key: 'J', action: 'hopp over', joker: true },
  { key: 'F', action: 'fullskjerm', joker: false },
]

export const GameHeader: React.FC<GameHeaderProps> = ({
  state,
  onEnd,
  onEditPlayers,
  onToggleFullscreen,
}) => {
  const round = Math.floor(state.turn / state.players.length) + 1
  const keyHints = KEY_HINTS.filter(
    hint => !hint.joker || state.settings.jokers
  )

  return (
    <header className={classes.header}>
      <span className={classes.headerTitle}>Truth or Drink</span>
      <span className={classes.muted}>Runde {round}</span>
      <span className={classes.keyHints}>
        {keyHints.map(hint => (
          <span key={hint.key}>
            <kbd className={classes.kbd}>{hint.key}</kbd> {hint.action}
          </span>
        ))}
      </span>
      <button
        type="button"
        className={classes.iconButton}
        aria-label="Legg til eller fjern spillere"
        onClick={onEditPlayers}
      >
        <IconUsers size="1.1em" />
      </button>
      <button
        type="button"
        className={classes.iconButton}
        aria-label="Fullskjerm"
        onClick={onToggleFullscreen}
      >
        <IconMaximize size="1.1em" />
      </button>
      <button
        type="button"
        className={classes.iconButton}
        aria-label="Avslutt spillet"
        onClick={onEnd}
      >
        <IconX size="1.1em" />
      </button>
    </header>
  )
}
