// Filters the scheduleAllergiesV2 week matrix to one day. The backend gives
// every person at work with an allergy, the days they work, and the number
// of people at work per day.

export interface AllergyWeek {
  allergies: string[]
  users: {
    userId: string
    name: string
    allergies: boolean[]
    days: string[]
  }[]
  allergyCounts: number[]
  peopleAtWork: number
  days: { date: string; peopleAtWork: number }[]
}

export interface AllergyView {
  allergies: string[]
  users: { userId: string; name: string; allergies: boolean[] }[]
  counts: number[]
  peopleAtWork: number
}

export const SOUP_TIME = { timeFrom: '14:00:00', timeTo: '16:00:00' }

export interface AllergySelection {
  day: string | null
  soupTime: boolean
}

export function selectAllergyDay(
  selection: AllergySelection,
  value: string
): AllergySelection {
  return value === 'week'
    ? { day: null, soupTime: false }
    : { ...selection, day: value }
}

export function toggleSoupTime(
  selection: AllergySelection,
  enabled: boolean
): AllergySelection {
  return selection.day === null
    ? { ...selection, soupTime: false }
    : { ...selection, soupTime: enabled }
}

export function handleSoupTimeChange(
  event: { currentTarget: { checked: boolean } },
  setSelection: (
    update: (current: AllergySelection) => AllergySelection
  ) => void
): void {
  // Read the DOM value before React runs the deferred state updater.
  const checked = event.currentTarget.checked
  setSelection(current => toggleSoupTime(current, checked))
}

export function allergyTimeVariables(selection: AllergySelection): {
  timeFrom?: string
  timeTo?: string
} {
  return selection.day !== null && selection.soupTime
    ? SOUP_TIME
    : {}
}

// day: a YYYY-MM-DD date, or null for the whole week. For one day, only the
// allergies of the people at work that day are columns.
export function allergyView(
  week: AllergyWeek,
  day: string | null
): AllergyView {
  if (day === null) {
    return {
      allergies: week.allergies,
      users: week.users,
      counts: week.allergyCounts,
      peopleAtWork: week.peopleAtWork,
    }
  }

  const users = week.users.filter(user => user.days.includes(day))
  const columns = week.allergies
    .map((name, index) => ({
      name,
      index,
      count: users.filter(user => user.allergies[index]).length,
    }))
    .filter(column => column.count > 0)

  return {
    allergies: columns.map(column => column.name),
    users: users.map(user => ({
      userId: user.userId,
      name: user.name,
      allergies: columns.map(column => user.allergies[column.index]),
    })),
    counts: columns.map(column => column.count),
    peopleAtWork:
      week.days.find(workDay => workDay.date === day)?.peopleAtWork ?? 0,
  }
}
