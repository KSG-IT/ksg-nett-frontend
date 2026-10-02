import {
  defaultGranularity,
  periodRange,
  periodRows,
  previousSemester,
  salesSummary,
  semesterStart,
  seriesColor,
} from './salesStatistics'

const products = [
  {
    productId: 'beer',
    name: 'Dahls',
    total: 140,
    quantity: 4,
    data: [
      { day: '2026-09-01', sum: 90 },
      { day: '2026-09-02', sum: 0 },
      { day: '2026-09-03', sum: 50 },
    ],
  },
  {
    productId: 'cider',
    name: 'Smirnoff Ice',
    total: 40,
    quantity: 1,
    data: [
      { day: '2026-09-01', sum: 0 },
      { day: '2026-09-02', sum: 0 },
      { day: '2026-09-03', sum: 40 },
    ],
  },
]

describe('periodRows', () => {
  it('makes one row per period with one key per product', () => {
    expect(periodRows(products)).toEqual([
      { day: '2026-09-01', beer: 90, cider: 0 },
      { day: '2026-09-02', beer: 0, cider: 0 },
      { day: '2026-09-03', beer: 50, cider: 40 },
    ])
  })

  it('returns no rows without products', () => {
    expect(periodRows([])).toEqual([])
  })
})

describe('salesSummary', () => {
  it('sums all products and averages over periods with sales', () => {
    expect(salesSummary(products)).toEqual({
      total: 180,
      quantity: 5,
      salesPeriods: 2,
      averagePerSalesPeriod: 90,
    })
  })

  it('counts a period with only refunds as a period with sales', () => {
    const refund = [
      { ...products[1], total: -30, data: [{ day: 'x', sum: -30 }] },
    ]
    expect(salesSummary(refund).salesPeriods).toEqual(1)
  })

  it('gives 0 without sales', () => {
    expect(salesSummary([])).toEqual({
      total: 0,
      quantity: 0,
      salesPeriods: 0,
      averagePerSalesPeriod: 0,
    })
  })
})

describe('seriesColor', () => {
  it('gives the first 24 products different colours', () => {
    const colors = Array.from({ length: 24 }, (_, index) => seriesColor(index))
    expect(new Set(colors).size).toEqual(24)
  })
})

describe('semesters', () => {
  it('starts the spring semester in January and autumn in August', () => {
    expect(semesterStart(new Date(2026, 6, 31))).toEqual('2026-01-01')
    expect(semesterStart(new Date(2026, 7, 1))).toEqual('2026-08-01')
  })

  it('finds the previous semester across the new year', () => {
    expect(previousSemester(new Date(2026, 9, 2))).toEqual([
      '2026-01-01',
      '2026-07-31',
    ])
    expect(previousSemester(new Date(2026, 1, 15))).toEqual([
      '2025-08-01',
      '2025-12-31',
    ])
  })
})

describe('periodRange', () => {
  const today = new Date(2026, 9, 2)
  const none: [null, null] = [null, null]

  it('runs "this semester", "this month" and "last 30 days" to today', () => {
    expect(periodRange('this-semester', today, none)).toEqual({
      dateFrom: '2026-08-01',
      dateTo: '2026-10-02',
    })
    expect(periodRange('this-month', today, none)).toEqual({
      dateFrom: '2026-10-01',
      dateTo: '2026-10-02',
    })
    expect(periodRange('last-30-days', today, none)).toEqual({
      dateFrom: '2026-09-03',
      dateTo: '2026-10-02',
    })
  })

  it('leaves dateFrom empty for all time, and uses the custom range', () => {
    expect(periodRange('all-time', today, none).dateFrom).toBeNull()
    expect(periodRange('custom', today, ['2023-01-01', '2023-01-31'])).toEqual({
      dateFrom: '2023-01-01',
      dateTo: '2023-01-31',
    })
  })
})

describe('defaultGranularity', () => {
  it('picks day, week or month from the length of the range', () => {
    expect(defaultGranularity('2026-09-01', '2026-10-02')).toEqual('DAY')
    expect(defaultGranularity('2026-08-01', '2026-10-15')).toEqual('WEEK')
    expect(defaultGranularity('2026-01-01', '2026-10-02')).toEqual('MONTH')
    expect(defaultGranularity(null, '2026-10-02')).toEqual('MONTH')
  })
})
