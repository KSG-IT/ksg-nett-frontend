import { useState } from 'react'
import { GameScreen } from '../components/Game'
import { Lobby } from '../components/Lobby'
import { PortraitHint } from '../components/PortraitHint'
import { useFullscreen } from '../useFullscreen'
import { useGameKeys } from '../useGameKeys'
import { useTodGame } from '../useTodGame'
import { useWakeLock } from '../useWakeLock'
import classes from './TruthOrDrink.module.css'

const TruthOrDrink: React.FC = () => {
  const { state, dispatch, reset } = useTodGame()
  const toggleFullscreen = useFullscreen()
  const [editingPlayers, setEditingPlayers] = useState(false)
  const [confirmingEnd, setConfirmingEnd] = useState(false)
  const playing = state.phase === 'playing'
  useGameKeys(
    state,
    dispatch,
    toggleFullscreen,
    !editingPlayers && !confirmingEnd
  )
  useWakeLock(playing)

  return (
    <div className={classes.root}>
      {playing ? (
        <GameScreen
          state={state}
          dispatch={dispatch}
          editingPlayers={editingPlayers}
          onEditPlayers={setEditingPlayers}
          confirmingEnd={confirmingEnd}
          onConfirmEnd={setConfirmingEnd}
          onToggleFullscreen={toggleFullscreen}
        />
      ) : (
        <Lobby state={state} dispatch={dispatch} onReset={reset} />
      )}
      {playing && <PortraitHint />}
    </div>
  )
}

export default TruthOrDrink
