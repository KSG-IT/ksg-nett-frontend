import { useStore } from 'store'

export function useMe() {
  return useStore(state => state.user)
}
