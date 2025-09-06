import { addMonths, subMonths } from 'date-fns'
import { useState } from 'react'

export function useMonth(date?: Date) {
  const [current, setCurrent] = useState(date || new Date())

  function incrementMonth() {
    setCurrent(prev => addMonths(prev, 1))
  }

  function decrementMonth() {
    setCurrent(prev => subMonths(prev, 1))
  }

  return {
    month: current,
    incrementMonth,
    decrementMonth,
  }
}
