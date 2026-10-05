import {
  filterTransferItems,
  sameIds,
  splitTransferItems,
} from './transferList'

const items = [
  { id: '1', name: 'Selleri' },
  { id: '2', name: 'Østers' },
  { id: '3', name: 'gluten' },
  { id: '4', name: 'Laktose' },
]

describe('splitTransferItems', () => {
  it('puts selected items on the right and the rest on the left', () => {
    const { available, selected } = splitTransferItems(items, ['4', '1'])

    expect(available.map(i => i.id)).toEqual(['3', '2'])
    expect(selected.map(i => i.id)).toEqual(['4', '1'])
  })

  it('sorts by name in Norwegian order without regard to case', () => {
    const { available } = splitTransferItems(items, [])

    expect(available.map(i => i.name)).toEqual([
      'gluten',
      'Laktose',
      'Selleri',
      'Østers',
    ])
  })

  it('ignores selected ids that are not in the items', () => {
    const { selected } = splitTransferItems(items, ['99', '3'])

    expect(selected.map(i => i.id)).toEqual(['3'])
  })

  it('does not change the input array', () => {
    const input = [...items]
    splitTransferItems(input, [])

    expect(input).toEqual(items)
  })
})

describe('filterTransferItems', () => {
  it('keeps all items for an empty or blank query', () => {
    expect(filterTransferItems(items, '  ')).toBe(items)
  })

  it('matches part of the name without regard to case', () => {
    expect(filterTransferItems(items, 'LAK').map(i => i.id)).toEqual(['4'])
  })

  it('matches Norwegian letters', () => {
    expect(filterTransferItems(items, 'øst').map(i => i.id)).toEqual(['2'])
  })

  it('is empty when nothing matches', () => {
    expect(filterTransferItems(items, 'peanøtt')).toEqual([])
  })
})

describe('sameIds', () => {
  it('is true for the same ids in another order', () => {
    expect(sameIds(['1', '2'], ['2', '1'])).toBe(true)
  })

  it('is false when one id is different', () => {
    expect(sameIds(['1', '2'], ['1', '3'])).toBe(false)
  })

  it('is false for lists of different length', () => {
    expect(sameIds(['1'], ['1', '2'])).toBe(false)
  })

  it('is true for two empty lists', () => {
    expect(sameIds([], [])).toBe(true)
  })
})
