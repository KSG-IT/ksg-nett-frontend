import { useQuery } from '@apollo/client'
import { IconArrowLeft, IconArrowRight } from '@tabler/icons-react'
import { Dispatch, useState } from 'react'
import { Link } from 'react-router-dom'
import { GameAction, GameState, MIN_PLAYERS } from '../../game'
import { TOD_INTERNAL_GROUPS_QUERY } from '../../queries'
import { TodInternalGroupsReturns } from '../../types.graphql'
import { AddPlayerInput } from './AddPlayerInput'
import { DeckBrowser } from './DeckBrowser'
import { Disclaimer } from './Disclaimer'
import classes from './Lobby.module.css'
import { LobbyPlayers } from './LobbyPlayers'
import { LobbySettings } from './LobbySettings'
import { ResetButton } from './ResetButton'

interface LobbyProps {
  state: GameState
  dispatch: Dispatch<GameAction>
  onReset: () => void
}

export const Lobby: React.FC<LobbyProps> = ({ state, dispatch, onReset }) => {
  const { data } = useQuery<TodInternalGroupsReturns>(TOD_INTERNAL_GROUPS_QUERY)
  const canStart = state.players.length >= MIN_PLAYERS
  const [browsingDecks, setBrowsingDecks] = useState(false)
  const [readingDisclaimer, setReadingDisclaimer] = useState(false)

  const handleStart = () => {
    const groups = (data?.allInternalGroupsByType ?? []).map(
      group => group.name
    )
    dispatch({ type: 'setGroups', groups })
    dispatch({ type: 'start' })
  }

  return (
    <div className={classes.lobby}>
      <section className={classes.players}>
        <Link to="/dashboard" className={classes.back}>
          <IconArrowLeft size="1em" /> Tilbake til KSG-nett
        </Link>
        <h1 className={classes.title}>Truth or Drink</h1>
        <h2 className={classes.heading}>Spillere · {state.players.length}</h2>
        <AddPlayerInput
          onAdd={player => dispatch({ type: 'addPlayer', player })}
        />
        <LobbyPlayers
          players={state.players}
          onRemove={playerId => dispatch({ type: 'removePlayer', playerId })}
        />
        <div className={classes.footer}>
          <p className={classes.note}>
            Spillet lagres bare i denne nettleseren. Ingen drikketall sendes til
            KSG-nett.
          </p>
          <ResetButton onReset={onReset} />
        </div>
      </section>

      <section className={classes.settings}>
        <LobbySettings
          settings={state.settings}
          playerCount={state.players.length}
          dispatch={dispatch}
          onOpenDecks={() => setBrowsingDecks(true)}
        />
        <button
          type="button"
          className={classes.start}
          disabled={!canStart}
          onClick={() => setReadingDisclaimer(true)}
        >
          {canStart ? 'Start' : `Minst ${MIN_PLAYERS} spillere`}
          <IconArrowRight size="1em" stroke={2.4} />
        </button>
      </section>
      {readingDisclaimer && (
        <Disclaimer
          onStart={handleStart}
          onBack={() => setReadingDisclaimer(false)}
        />
      )}
      {browsingDecks && (
        <DeckBrowser
          settings={state.settings}
          deckEdits={state.deckEdits}
          dispatch={dispatch}
          onClose={() => setBrowsingDecks(false)}
        />
      )}
    </div>
  )
}
