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
