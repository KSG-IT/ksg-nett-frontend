export interface TransferItem {
  id: string
  name: string
}

export interface TransferSides<T extends TransferItem> {
  available: T[]
  selected: T[]
}

// Splits all items into the two boxes of the transfer list. Both sides are
// sorted by name in Norwegian order, so "Ø" comes after "Z".
export function splitTransferItems<T extends TransferItem>(
  items: T[],
  selectedIds: string[]
): TransferSides<T> {
  const selected = new Set(selectedIds)
  const sorted = [...items].sort((a, b) => a.name.localeCompare(b.name, 'nb'))

  return {
    available: sorted.filter(item => !selected.has(item.id)),
    selected: sorted.filter(item => selected.has(item.id)),
  }
}

// Case-insensitive search on the name. An empty query keeps all items.
export function filterTransferItems<T extends TransferItem>(
  items: T[],
  query: string
): T[] {
  const needle = query.trim().toLocaleLowerCase('nb')
  if (needle === '') return items

  return items.filter(item =>
    item.name.toLocaleLowerCase('nb').includes(needle)
  )
}

// True when the two id lists hold the same ids, in any order.
export function sameIds(a: string[], b: string[]): boolean {
  if (a.length !== b.length) return false

  const set = new Set(a)
  return b.every(id => set.has(id))
}
