import {
  allergyTimeVariables,
  allergyView,
  AllergySelection,
  AllergyWeek,
  selectAllergyDay,
  toggleSoupTime,
} from './allergyWeek'

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

describe('allergy selection', () => {
  it('keeps the selected day when suppetime is toggled or data refetches', () => {
    const selected: AllergySelection = selectAllergyDay(
      { day: null, soupTime: false },
      '2026-09-09'
    )
    const filtered = toggleSoupTime(selected, true)

    expect(filtered).toEqual({ day: '2026-09-09', soupTime: true })
    expect(allergyTimeVariables(filtered)).toEqual({
      timeFrom: '14:00:00',
      timeTo: '16:00:00',
    })
    // A query response/refetch does not derive selection from returned days.
    expect(toggleSoupTime(filtered, false)).toEqual({
      day: '2026-09-09',
      soupTime: false,
    })
  })

  it('turns suppetime off for Hele uka and keeps it off on later day selection', () => {
    const filtered = { day: '2026-09-09', soupTime: true }
    const week = selectAllergyDay(filtered, 'week')

    expect(week).toEqual({ day: null, soupTime: false })
    expect(selectAllergyDay(week, '2026-09-13')).toEqual({
      day: '2026-09-13',
      soupTime: false,
    })
    expect(allergyTimeVariables(week)).toEqual({})
  })

  it('cannot enable suppetime without a specific day', () => {
    expect(toggleSoupTime({ day: null, soupTime: false }, true)).toEqual({
      day: null,
      soupTime: false,
    })
  })
})
