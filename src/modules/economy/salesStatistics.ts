// Turns productOrdersByItemAndDateList into chart data for the sales
// statistics page. The backend returns every period in the range (day, week
// or month), also periods without sales, so all products share the same
// periods.

export type SalesGranularity = 'DAY' | 'WEEK' | 'MONTH' | 'SEMESTER'

export interface ProductSalesInput {
  productId: string
  name: string
  total: number
  quantity: number
  data: { day: string; sum: number }[]
}

export interface SalesSummary {
  total: number
  quantity: number
  salesPeriods: number
  averagePerSalesPeriod: number
}

// One row per period, with one key per product id, as LineChart expects
export function periodRows(products: ProductSalesInput[]) {
  const periods = products[0]?.data.map(point => point.day) ?? []
  return periods.map((day, index) => {
    const row: Record<string, string | number> = { day }
    products.forEach(product => {
      row[product.productId] = product.data[index]?.sum ?? 0
    })
    return row
  })
}

// A sales period is a day, week or month where at least one product sold
export function salesSummary(products: ProductSalesInput[]): SalesSummary {
  const total = products.reduce((sum, product) => sum + product.total, 0)
  const quantity = products.reduce((sum, product) => sum + product.quantity, 0)
  const salesPeriods = periodRows(products).filter(row =>
    products.some(product => Number(row[product.productId]) !== 0)
  ).length

  return {
    total,
    quantity,
    salesPeriods,
    averagePerSalesPeriod: salesPeriods ? Math.round(total / salesPeriods) : 0,
  }
}

// 12 hues that are easy to tell apart. After 12 products the hues repeat in
// a darker shade, so no two of the first 24 products share a colour.
const SERIES_HUES = [
  'samfundet-red',
  'blue',
  'teal',
  'yellow',
  'violet',
  'orange',
  'cyan',
  'pink',
  'green',
  'indigo',
  'lime',
  'grape',
]

// The same product keeps its colour in all charts on the page
export function seriesColor(index: number) {
  const hue = SERIES_HUES[index % SERIES_HUES.length]
  const shade = Math.floor(index / SERIES_HUES.length) % 2 === 0 ? 6 : 9
  return `${hue}.${shade}`
}

const pad = (value: number) => String(value).padStart(2, '0')
export const isoDate = (date: Date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`

// Same rule as InternalGroupPositionMembership.get_semester_of_membership in
// the backend: August to December is autumn (H), January to July is spring (V).
export function semesterStart(date: Date): string {
  const autumn = date.getMonth() >= 7
  return `${date.getFullYear()}-${autumn ? '08' : '01'}-01`
}

// The semester before the one date is in, as [first day, last day]
export function previousSemester(date: Date): [string, string] {
  const year = date.getFullYear()
  return date.getMonth() >= 7
    ? [`${year}-01-01`, `${year}-07-31`]
    : [`${year - 1}-08-01`, `${year - 1}-12-31`]
}

export type SalesPeriod =
  | 'this-semester'
  | 'last-semester'
  | 'this-month'
  | 'last-30-days'
  | 'all-time'
  | 'custom'

export const SALES_PERIOD_OPTIONS: { value: SalesPeriod; label: string }[] = [
  { value: 'this-semester', label: 'Dette semesteret' },
  { value: 'last-semester', label: 'Forrige semester' },
  { value: 'this-month', label: 'Denne måneden' },
  { value: 'last-30-days', label: 'Siste 30 dager' },
  { value: 'all-time', label: 'Alle tider' },
  { value: 'custom', label: 'Egendefinert' },
]

// dateFrom null means from the first sale (the backend finds it)
export function periodRange(
  period: SalesPeriod,
  today: Date,
  custom: [string | null, string | null]
): { dateFrom: string | null; dateTo: string | null } {
  const todayIso = isoDate(today)
  switch (period) {
    case 'this-semester':
      return { dateFrom: semesterStart(today), dateTo: todayIso }
    case 'last-semester': {
      const [dateFrom, dateTo] = previousSemester(today)
      return { dateFrom, dateTo }
    }
    case 'this-month':
      return { dateFrom: todayIso.slice(0, 8) + '01', dateTo: todayIso }
    case 'last-30-days': {
      const start = new Date(today)
      start.setDate(today.getDate() - 29)
      return { dateFrom: isoDate(start), dateTo: todayIso }
    }
    case 'all-time':
      return { dateFrom: null, dateTo: todayIso }
    case 'custom':
      return { dateFrom: custom[0], dateTo: custom[1] }
  }
}

// All time is only shown per semester. It is the longest range, and per
// month it was too heavy to load and to read.
export function allowedGranularities(period: SalesPeriod): SalesGranularity[] {
  return period === 'all-time' ? ['SEMESTER'] : ['DAY', 'WEEK', 'MONTH']
}

// Month keeps the first load small. A month or less is shown per day,
// because one or two points per line say nothing.
export function defaultGranularity(
  period: SalesPeriod,
  dateFrom: string | null,
  dateTo: string | null
): SalesGranularity {
  if (period === 'all-time') return 'SEMESTER'
  if (dateFrom && dateTo) {
    const days =
      (new Date(dateTo).getTime() - new Date(dateFrom).getTime()) / 86_400_000
    if (days < 31) return 'DAY'
  }
  return 'MONTH'
}

// "H23" for 2023-08-01, "V24" for 2024-01-01
export function semesterLabel(day: string) {
  const [year, month] = day.split('-').map(Number)
  return `${month >= 8 ? 'H' : 'V'}${String(year).slice(2)}`
}

export const GRANULARITY_LABELS: Record<
  SalesGranularity,
  { option: string; average: string; one: string; periods: string }
> = {
  DAY: {
    option: 'Dag',
    average: 'Snitt per salgsdag',
    one: 'dag',
    periods: 'dager',
  },
  WEEK: {
    option: 'Uke',
    average: 'Snitt per uke med salg',
    one: 'uke',
    periods: 'uker',
  },
  MONTH: {
    option: 'Måned',
    average: 'Snitt per måned med salg',
    one: 'måned',
    periods: 'måneder',
  },
  SEMESTER: {
    option: 'Semester',
    average: 'Snitt per semester med salg',
    one: 'semester',
    periods: 'semestre',
  },
}

// "1 måned", "3 måneder"
export function periodCount(count: number, granularity: SalesGranularity) {
  const labels = GRANULARITY_LABELS[granularity]
  return `${count} ${count === 1 ? labels.one : labels.periods}`
}

// Chart tooltips list one item per product. periodRows gives 0 for the
// products with no sales in a period, so drop those.
export function nonZeroItems<T extends { value?: unknown }>(
  items: readonly T[] | undefined
) {
  return (items ?? []).filter(item => Number(item.value) !== 0)
}
