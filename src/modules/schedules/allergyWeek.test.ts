import { allergyView, AllergyWeek } from './allergyWeek'

const week: AllergyWeek = {
  allergies: ['Gluten', 'Laktose'],
  users: [
    {
      userId: 'anna',
      name: 'Anna A',
      allergies: [true, true],
      days: ['2026-09-07', '2026-09-09'],
    },
    {
      userId: 'carl',
      name: 'Carl C',
      allergies: [true, false],
      days: ['2026-09-13'],
    },
  ],
  allergyCounts: [2, 1],
  peopleAtWork: 3,
  days: [
    { date: '2026-09-07', peopleAtWork: 2 },
    { date: '2026-09-09', peopleAtWork: 1 },
    { date: '2026-09-13', peopleAtWork: 1 },
  ],
}

describe('allergyView', () => {
  it('shows the whole week as the backend sends it', () => {
    expect(allergyView(week, null)).toEqual({
      allergies: ['Gluten', 'Laktose'],
      users: week.users,
      counts: [2, 1],
      peopleAtWork: 3,
    })
  })

  it('keeps only the people and allergies of one day', () => {
    expect(allergyView(week, '2026-09-13')).toEqual({
      allergies: ['Gluten'],
      users: [{ userId: 'carl', name: 'Carl C', allergies: [true] }],
      counts: [1],
      peopleAtWork: 1,
    })
  })

  it('gives an empty view for a day without shifts', () => {
    expect(allergyView(week, '2026-09-08')).toEqual({
      allergies: [],
      users: [],
      counts: [],
      peopleAtWork: 0,
    })
  })
})
