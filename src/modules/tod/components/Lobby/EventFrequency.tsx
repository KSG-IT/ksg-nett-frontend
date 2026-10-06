import { Dispatch } from 'react'
import { Pack } from '../../enums'
import { EventKind, GameAction, resolveEventTurns, Settings } from '../../game'
import classes from './Lobby.module.css'

interface EventFrequencyProps {
  settings: Settings
  playerCount: number
  dispatch: Dispatch<GameAction>
}

const KINDS: { kind: EventKind; pack: Pack; name: string }[] = [
  { kind: 'virus', pack: Pack.VIRUS, name: 'Nytt virus' },
  { kind: 'rule', pack: Pack.RULE, name: 'Ny regel' },
  { kind: 'mission', pack: Pack.MISSION, name: 'Nytt oppdrag' },
]

// A value nobody has changed follows the player count until the game
// starts. The game then keeps the values, also when players join.
export const EventFrequency: React.FC<EventFrequencyProps> = ({
  settings,
  playerCount,
  dispatch,
}) => {
  const kinds = KINDS.filter(({ pack }) => settings.packs[pack])
  if (kinds.length === 0) return null
  const turns = resolveEventTurns(settings, playerCount)

  return (
    <>
      <h2 className={classes.heading}>Hvor ofte?</h2>
      {kinds.map(({ kind, name }) => {
        const custom = settings.eventTurns[kind] !== null
        const set = (value: number | null) =>
          dispatch({ type: 'setEventTurns', kind, turns: value })
        return (
          <div key={kind} className={classes.frequency} data-color={kind}>
            <span className={classes.packDot} />
            <span className={classes.packText}>
              <span className={classes.packName}>{name}</span>
              <span className={classes.packHint}>
                {everyLabel(turns[kind])}
                {custom ? (
                  <>
                    {' · '}
                    <button
                      type="button"
                      className={classes.linkButton}
                      onClick={() => set(null)}
                    >
                      følg antall spillere
                    </button>
                  </>
                ) : (
                  ' · følger antall spillere'
                )}
              </span>
            </span>
            <span className={classes.stepper}>
              <button
                type="button"
                aria-label={`${name}: færre turer`}
                disabled={turns[kind] <= 1}
                onClick={() => set(turns[kind] - 1)}
              >
                −
              </button>
              <span className={classes.stepperValue}>{turns[kind]}</span>
              <button
                type="button"
                aria-label={`${name}: flere turer`}
                onClick={() => set(turns[kind] + 1)}
              >
                +
              </button>
            </span>
          </div>
        )
      })}
    </>
  )
}

function everyLabel(turns: number) {
  return turns === 1 ? 'Hver tur' : `Hver ${turns}. tur`
}
