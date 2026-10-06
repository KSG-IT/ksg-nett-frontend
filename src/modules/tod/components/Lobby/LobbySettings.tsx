import { Dispatch } from 'react'
import { PACK_OPTIONS, PENALTY_LABELS, SPICE_OPTIONS } from '../../display'
import { Pack, Penalty } from '../../enums'
import { GameAction, Settings } from '../../game'
import classes from './Lobby.module.css'
import { EventFrequency } from './EventFrequency'
import { SwitchRow } from './SwitchRow'

interface LobbySettingsProps {
  settings: Settings
  playerCount: number
  dispatch: Dispatch<GameAction>
  onOpenDecks: () => void
}

const PENALTIES = [
  { penalty: Penalty.SIPS, name: 'Slurker' },
  { penalty: Penalty.SHOT, name: 'Shots' },
]

const MISSION_DEADLINES = [
  { turns: null, name: 'Ingen' },
  { turns: 5, name: '5 turer' },
  { turns: 10, name: '10 turer' },
  { turns: 15, name: '15 turer' },
]

export const LobbySettings: React.FC<LobbySettingsProps> = ({
  settings,
  playerCount,
  dispatch,
  onOpenDecks,
}) => (
  <>
    <h2 className={classes.heading}>Hvor drøyt?</h2>
    <div className={classes.spiceGrid}>
      {SPICE_OPTIONS.map(option => (
        <button
          key={option.spice}
          type="button"
          className={classes.choice}
          aria-pressed={settings.spice === option.spice}
          onClick={() => dispatch({ type: 'setSpice', spice: option.spice })}
        >
          {option.name}
          <span className={classes.choiceHint}>{option.hint}</span>
        </button>
      ))}
    </div>

    <h2 className={classes.heading}>Kortstokker</h2>
    <PackSwitches settings={settings} dispatch={dispatch} />
    <button type="button" className={classes.linkButton} onClick={onOpenDecks}>
      Se og endre kortene
    </button>

    <EventFrequency
      settings={settings}
      playerCount={playerCount}
      dispatch={dispatch}
    />

    <h2 className={classes.heading}>Straff</h2>
    <div className={classes.penaltyRow}>
      {PENALTIES.map(option => (
        <button
          key={option.penalty}
          type="button"
          className={classes.choice}
          aria-pressed={settings.penalty === option.penalty}
          onClick={() =>
            dispatch({ type: 'setPenalty', penalty: option.penalty })
          }
        >
          {option.name}
          <span className={classes.choiceHint}>
            {PENALTY_LABELS[option.penalty]}
          </span>
        </button>
      ))}
    </div>
    <SwitchRow
      name="Joker"
      hint="Hver spiller kan hoppe over ett kort uten å drikke"
      color="joker"
      checked={settings.jokers}
      onToggle={() => dispatch({ type: 'toggleJokers' })}
    />

    {settings.packs[Pack.MISSION] && (
      <>
        <h2 className={classes.heading}>Frist for oppdrag</h2>
        <p className={classes.hint}>
          Oppdraget avsløres når fristen går ut, og dere avgjør om det er
          fullført.
        </p>
        <div className={classes.deadlineRow}>
          {MISSION_DEADLINES.map(option => (
            <button
              key={option.name}
              type="button"
              className={classes.choice}
              aria-pressed={settings.missionTurns === option.turns}
              onClick={() =>
                dispatch({ type: 'setMissionTurns', turns: option.turns })
              }
            >
              {option.name}
            </button>
          ))}
        </div>
      </>
    )}
  </>
)

const PackSwitches: React.FC<
  Pick<LobbySettingsProps, 'settings' | 'dispatch'>
> = ({ settings, dispatch }) => (
  <ul className={classes.packList}>
    {PACK_OPTIONS.map(option => (
      <li key={option.pack}>
        <SwitchRow
          name={option.name}
          hint={option.hint}
          color={option.pack}
          checked={settings.packs[option.pack]}
          onToggle={() => dispatch({ type: 'togglePack', pack: option.pack })}
        />
      </li>
    ))}
  </ul>
)
