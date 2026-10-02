import { useMemo, useState } from 'react'
import { SortDirection, sortRecords, SortValue } from './tableSort'

export interface TableSortState<K extends string> {
  sortBy: K
  direction: SortDirection
}

// Client-side sorting for small tables. A click on the active column flips
// the direction; a click on another column sorts it ascending.
export function useTableSort<T, K extends string>(
  records: T[],
  getters: Record<K, (record: T) => SortValue>,
  initial: TableSortState<NoInfer<K>>
) {
  const [sort, setSort] = useState(initial)

  const sorted = useMemo(
    () => sortRecords(records, getters[sort.sortBy], sort.direction),
    // getters is usually a module constant
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [records, sort]
  )

  function toggle(sortBy: K) {
    setSort(current => ({
      sortBy,
      direction:
        current.sortBy === sortBy && current.direction === 'asc'
          ? 'desc'
          : 'asc',
    }))
  }

  // Props for SortableTh
  const headerProps = (sortBy: K) => ({
    sorted: sort.sortBy === sortBy,
    direction: sort.direction,
    onSort: () => toggle(sortBy),
  })

  return { sorted, sort, headerProps }
}
