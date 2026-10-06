import { Dispatch } from 'react'
import { firstName, playerColor } from '../../display'
import { GameAction, GameState, hasDeadline } from '../../game'
import { PlayerAvatar } from '../PlayerAvatar'
import classes from './Game.module.css'

interface MissionListProps {
  state: GameState
  dispatch: Dispatch<GameAction>
}

const VISIBLE_MISSIONS = 3

// The TV shows who has a mission and the turns left, never the mission
// itself until someone reveals it.
export const MissionList: React.FC<MissionListProps> = ({
  state,
  dispatch,
}) => {
  const missions = state.missions.slice(-VISIBLE_MISSIONS)

  return (
    <>
      <h2 className={classes.railHeading} data-kind="mission">
        Oppdrag i gang
      </h2>
      {missions.map(mission => {
        const index = state.players.findIndex(p => p.id === mission.playerId)
        const player = state.players[index]
        if (!player) return null
        return (
          <div key={mission.id} className={classes.panelPlayer}>
            <PlayerAvatar
              player={player}
              color={playerColor(index)}
              size="sm"
            />
            <span className={classes.missionWho}>
              {firstName(player.name)} har et hemmelig oppdrag.
              {hasDeadline(mission) && (
                <span className={classes.missionTurns}>
                  {turnsLeftLabel(mission.turnsLeft)}
                </span>
              )}
            </span>
            <button
              type="button"
              className={classes.revealButton}
              onClick={() =>
                dispatch({ type: 'revealMission', missionId: mission.id })
              }
            >
              Avslør
            </button>
          </div>
        )
      })}
    </>
  )
}

function turnsLeftLabel(turnsLeft: number) {
  return turnsLeft === 1 ? '1 tur igjen' : `${turnsLeft} turer igjen`
}
