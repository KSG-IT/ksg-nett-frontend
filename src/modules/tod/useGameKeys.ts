import { Dispatch, useEffect } from 'react'
import { GameAction, GameState } from './game'

const NEXT_KEYS = [' ', 'ArrowRight', 'PageDown', 'Enter']
// A presentation remote has two buttons: next and back. Back counts a drink.
const DRINK_KEYS = ['d', 'D', 'ArrowLeft', 'PageUp']
const JOKER_KEYS = ['j', 'J']
const FULLSCREEN_KEYS = ['f', 'F']
const TYPING_TAGS = ['INPUT', 'TEXTAREA', 'SELECT']

function actionForKey(key: string, state: GameState): GameAction | null {
  const event = state.events[0]
  if (event) {
    // A mission needs a button: read it, or give a verdict.
    if (event.type === 'mission' || event.type === 'missionReveal') return null
    return NEXT_KEYS.includes(key) ? { type: 'dismissEvent' } : null
  }
  if (NEXT_KEYS.includes(key)) return { type: 'next' }
  if (DRINK_KEYS.includes(key)) return { type: 'drink' }
  if (JOKER_KEYS.includes(key)) return { type: 'joker' }
  return null
}

function isTyping(target: EventTarget | null) {
  return target instanceof HTMLElement && TYPING_TAGS.includes(target.tagName)
}

// Keys for the laptop keyboard and for a presentation remote.
export function useGameKeys(
  state: GameState,
  dispatch: Dispatch<GameAction>,
  onToggleFullscreen: () => void,
  enabled: boolean
) {
  useEffect(() => {
    if (!enabled || state.phase !== 'playing') return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.repeat || event.metaKey || event.ctrlKey || event.altKey) return
      if (isTyping(event.target)) return
      if (FULLSCREEN_KEYS.includes(event.key)) {
        onToggleFullscreen()
        return
      }
      const action = actionForKey(event.key, state)
      if (!action) return
      // Stop a focused button from also reacting to Space or Enter.
      event.preventDefault()
      dispatch(action)
    }
    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.key === ' ' && actionForKey(' ', state)) event.preventDefault()
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [state, dispatch, onToggleFullscreen, enabled])
}
