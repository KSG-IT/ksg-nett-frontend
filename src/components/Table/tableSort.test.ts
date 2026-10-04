import { sortRecords } from './tableSort'

const rows = [
  { name: 'Ørjan', year: 2021 },
  { name: 'Anne', year: null },
  { name: 'Åse', year: 2019 },
  { name: 'Bjørn', year: 2020 },
]

describe('sortRecords', () => {
  it('sorts strings with Norwegian collation', () => {
    expect(sortRecords(rows, row => row.name, 'asc').map(r => r.name)).toEqual([
      'Anne',
      'Bjørn',
      'Ørjan',
      'Åse',
    ])
  })

  it('sorts numbers in both directions and keeps empty values last', () => {
    expect(sortRecords(rows, row => row.year, 'asc').map(r => r.year)).toEqual([
      2019,
      2020,
      2021,
      null,
    ])
    expect(sortRecords(rows, row => row.year, 'desc').map(r => r.year)).toEqual(
      [2021, 2020, 2019, null]
    )
  })

  it('does not change the input', () => {
    const copy = [...rows]
    sortRecords(rows, row => row.name, 'desc')
    expect(rows).toEqual(copy)
  })
})
