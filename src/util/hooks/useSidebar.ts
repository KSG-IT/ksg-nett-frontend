import { useStore } from 'store'

export function useSidebar() {
  const sidebarOpen = useStore(state => state.sidebarOpen)
  const toggleSidebar = useStore(state => state.toggleSidebarOpen)

  return {
    sidebarOpen,
    toggleSidebar,
  }
}
