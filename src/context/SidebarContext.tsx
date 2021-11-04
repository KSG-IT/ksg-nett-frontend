import { createContext, useState } from 'react'

interface SidebarContextProps {
  open: boolean
  toggle: () => void
}

export const SidebarContext = createContext({open: true})

export const SidebarProvider: React.FC = ({ children }) => {
  const [open, setOpen] = useState(true)

  const toggle = () => {
    setOpen(!open)
  }

  const value = {
    open,
    toggle,
  }
  return (
    <SidebarContext.Provider value={value}>
      {children}
    </SidebarContext.Provider>
  )
}
