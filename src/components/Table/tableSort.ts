export type SortValue = string | number | null | undefined

export type SortDirection = 'asc' | 'desc'

// Sorts a copy of the records by the value the getter returns. Strings
// compare with Norwegian collation. Empty values go last in both directions.
export function sortRecords<T>(
  records: T[],
  getValue: (record: T) => SortValue,
  direction: SortDirection
): T[] {
  const sign = direction === 'asc' ? 1 : -1
  return [...records].sort((a, b) => {
    const x = getValue(a)
    const y = getValue(b)
    const xEmpty = x === null || x === undefined || x === ''
    const yEmpty = y === null || y === undefined || y === ''
    if (xEmpty || yEmpty) return Number(xEmpty) - Number(yEmpty)
    if (typeof x === 'number' && typeof y === 'number') return (x - y) * sign
    return String(x).localeCompare(String(y), 'nb') * sign
  })
}
