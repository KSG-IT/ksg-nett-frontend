import { useStore } from '../../store'

export const useMe = () => {
  return useStore(state => state.user)
}
