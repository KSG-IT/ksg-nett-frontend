import { KeyboardEvent, useState } from 'react'

// A row that opens and closes with a click, Enter or Space.
export function useExpandableRow() {
  const [expanded, setExpanded] = useState(false)

  function toggle() {
    setExpanded(value => !value)
  }

  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      toggle()
    }
  }

  return {
    expanded,
    rowProps: {
      role: 'button',
      tabIndex: 0,
      'aria-expanded': expanded,
      onClick: toggle,
      onKeyDown: handleKeyDown,
    },
  }
}
