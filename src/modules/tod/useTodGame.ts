import { useEffect, useReducer } from 'react'
import { createInitialState, gameReducer, restoreState } from './game'

const STORAGE_KEY = 'truth-or-drink:v1'

function newSeed() {
  return Math.floor(Math.random() * 2 ** 32)
}

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return restoreState(saved ? JSON.parse(saved) : null, newSeed())
  } catch {
    return createInitialState(newSeed())
  }
}

// The game lives only in this browser. Nothing goes to the backend.
export function useTodGame() {
  const [state, dispatch] = useReducer(gameReducer, undefined, loadState)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      // Private mode or a full storage: the game still works without saving.
    }
  }, [state])

  const reset = () => dispatch({ type: 'reset', seed: newSeed() })

  return { state, dispatch, reset }
}
