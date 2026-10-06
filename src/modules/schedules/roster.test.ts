import {
  DefaultAvailabilityValues,
  RoleValues,
  RosterChangeKindValues,
} from './consts'
import {
  EMPTY_ROSTER_FILTER,
  availabilityLabel,
  availableAverage,
  averageFlag,
  addEntryFormSchema,
  capInput,
  capLabel,
  capState,
  changeCountLabel,
  countScale,
  filterRoster,
  formatAverage,
  groupSyncPreview,
  manualBadge,
  membershipTypeKey,
  membershipTypeLabel,
  membershipTypeOptions,
  newRuleFormSchema,
  percentOf,
  positionOptions,
  roleOptions,
  rosterFormDefaults,
  rosterFormSchema,
  rosterSummary,
  syncChangeCount,
} from './roster'
import { RosterChangeNode, ScheduleRosterNode } from './types.graphql'

const { AVAILABLE, OPT_IN } = DefaultAvailabilityValues

function row(
  name: string,
  overrides: Partial<ScheduleRosterNode> = {}
): ScheduleRosterNode {
  return {
    id: `row-${name}`,
    user: {
      id: `user-${name}`,
      fullName: name,
      initials: name.slice(0, 2),
      profileImage: null,
    },
    autofillAs: RoleValues.BARTENDER,
    defaultAvailability: AVAILABLE,
    shiftCap: null,
    manuallyEdited: false,
    addedManually: false,
    countFrom: null,
    membershipType: 'gang-member',
    shiftsDone: 0,
    shiftsPlanned: 0,
    lastShift: null,
    ...overrides,
  }
}

function change(name: string, kind: RosterChangeKindValues): RosterChangeNode {
  return {
    kind,
    user: { id: `user-${name}`, fullName: name },
    autofillAs: null,
    defaultAvailability: null,
    shiftCap: null,
    message: null,
  }
}

describe('labels', () => {
  it('gives the same key for a raw membership type and an enum name', () => {
    expect(membershipTypeKey('active-functionary-pang')).toBe(
      'ACTIVE_FUNCTIONARY_PANG'
    )
    expect(membershipTypeKey('ACTIVE_FUNCTIONARY_PANG')).toBe(
      'ACTIVE_FUNCTIONARY_PANG'
    )
  })

  it('gives Norwegian labels for membership types', () => {
    expect(membershipTypeLabel('hangaround')).toBe('Hangaround')
    expect(membershipTypeLabel('GANG_MEMBER')).toBe('Gjengmedlem')
    expect(membershipTypeLabel('temporary-leave')).toBe('Permisjon')
  })

  it('has a label for a row without a membership', () => {
    expect(membershipTypeLabel(null)).toBe('Uten medlemskap')
  })

  it('shows an unknown membership type as it is', () => {
    expect(membershipTypeLabel('new-type')).toBe('new-type')
  })

  it('gives Norwegian labels for the default availability', () => {
    expect(availabilityLabel(AVAILABLE)).toBe('Tilgjengelig')
    expect(availabilityLabel(OPT_IN)).toBe('Påmelding')
  })

  it('shows a dash for no cap', () => {
    expect(capLabel(null)).toBe('–')
    expect(capLabel(0)).toBe('0')
  })
})

describe('availableAverage', () => {
  it('averages done and planned shifts of the available rows only', () => {
    const rows = [
      row('A', { shiftsDone: 2, shiftsPlanned: 2 }),
      row('B', { shiftsDone: 1, shiftsPlanned: 1 }),
      row('C', { shiftsDone: 9, defaultAvailability: OPT_IN }),
    ]
    expect(availableAverage(rows)).toBe(3)
  })

  it('is null without available rows', () => {
    expect(availableAverage([])).toBeNull()
    expect(availableAverage([row('A', { defaultAvailability: OPT_IN })])).toBe(
      null
    )
  })
})

describe('averageFlag', () => {
  it('flags an available row a full shift over or under the average', () => {
    expect(averageFlag(row('A', { shiftsDone: 4 }), 3)).toBe('over')
    expect(averageFlag(row('A', { shiftsDone: 2 }), 3)).toBe('under')
  })

  it('does not flag a row less than a shift from the average', () => {
    expect(averageFlag(row('A', { shiftsDone: 3 }), 2.5)).toBeNull()
    expect(averageFlag(row('A', { shiftsDone: 2 }), 2.5)).toBeNull()
  })

  it('does not flag opt-in rows or rows without an average', () => {
    expect(
      averageFlag(row('A', { shiftsDone: 9, defaultAvailability: OPT_IN }), 2)
    ).toBeNull()
    expect(averageFlag(row('A', { shiftsDone: 9 }), null)).toBeNull()
  })
})

describe('capState', () => {
  it('is null without a cap', () => {
    expect(capState(row('A'))).toBeNull()
  })

  it('counts done and planned shifts against the cap', () => {
    expect(
      capState(row('A', { shiftCap: 3, shiftsDone: 1, shiftsPlanned: 1 }))
    ).toEqual({ label: '2 / 3', percent: 67, reached: false })
  })

  it('is reached at the cap and does not go over 100 percent', () => {
    expect(capState(row('A', { shiftCap: 2, shiftsDone: 3 }))).toEqual({
      label: '3 / 2',
      percent: 100,
      reached: true,
    })
  })

  it('is reached at once with a cap of 0', () => {
    expect(capState(row('A', { shiftCap: 0 }))).toEqual({
      label: '0 / 0',
      percent: 100,
      reached: true,
    })
  })
})

describe('manualBadge', () => {
  it('names a row added by hand', () => {
    expect(
      manualBadge(row('A', { addedManually: true, manuallyEdited: true }))
    ).toBe('Lagt til manuelt')
  })

  it('names a row edited by hand', () => {
    expect(manualBadge(row('A', { manuallyEdited: true }))).toBe(
      'Endret manuelt'
    )
  })

  it('is null for a row from the sync', () => {
    expect(manualBadge(row('A'))).toBeNull()
  })
})

describe('rosterSummary', () => {
  it('counts the rows, the defaults and the opt-in rows at the cap', () => {
    const rows = [
      row('A', { shiftsDone: 2 }),
      row('B', { shiftsDone: 4 }),
      row('C', { defaultAvailability: OPT_IN, shiftCap: 1, shiftsDone: 1 }),
      row('D', { defaultAvailability: OPT_IN, shiftCap: 2, shiftsDone: 1 }),
      row('E', { defaultAvailability: OPT_IN }),
    ]
    expect(rosterSummary(rows)).toEqual({
      total: 5,
      available: 2,
      optIn: 3,
      average: 3,
      optInAtCap: 1,
    })
  })

  it('works for an empty roster', () => {
    expect(rosterSummary([])).toEqual({
      total: 0,
      available: 0,
      optIn: 0,
      average: null,
      optInAtCap: 0,
    })
  })
})

describe('formatAverage', () => {
  it('rounds to one decimal with a Norwegian comma', () => {
    expect(formatAverage(7 / 3)).toBe('2,3')
    expect(formatAverage(3)).toBe('3')
  })

  it('shows a dash without an average', () => {
    expect(formatAverage(null)).toBe('–')
  })
})

describe('countScale and percentOf', () => {
  it('uses the largest count or the average as the scale', () => {
    const rows = [row('A', { shiftsDone: 2 }), row('B', { shiftsPlanned: 5 })]
    expect(countScale(rows, 3.5)).toBe(5)
    expect(countScale([row('A')], 2.5)).toBe(2.5)
  })

  it('is at least 1, so an empty roster has no division by zero', () => {
    expect(countScale([], null)).toBe(1)
  })

  it('gives a percent of the scale, at most 100', () => {
    expect(percentOf(2, 8)).toBe(25)
    expect(percentOf(9, 8)).toBe(100)
  })
})

describe('filterRoster', () => {
  const rows = [
    row('Per', { shiftsDone: 3, membershipType: 'hangaround' }),
    row('Åse', { shiftsDone: 1, autofillAs: RoleValues.BARSJEF }),
    row('Kari', { shiftsDone: 1, membershipType: null }),
  ]
  const names = (result: ScheduleRosterNode[]) =>
    result.map(r => r.user.fullName)

  it('sorts by the fewest shifts first, then by name', () => {
    expect(names(filterRoster(rows, EMPTY_ROSTER_FILTER))).toEqual([
      'Kari',
      'Åse',
      'Per',
    ])
  })

  it('sorts by the most shifts first', () => {
    expect(
      names(filterRoster(rows, { ...EMPTY_ROSTER_FILTER, sort: 'most' }))
    ).toEqual(['Per', 'Kari', 'Åse'])
  })

  it('sorts by Norwegian name order', () => {
    expect(
      names(filterRoster(rows, { ...EMPTY_ROSTER_FILTER, sort: 'name' }))
    ).toEqual(['Kari', 'Per', 'Åse'])
  })

  it('filters by membership type, also for rows without one', () => {
    expect(
      names(
        filterRoster(rows, {
          ...EMPTY_ROSTER_FILTER,
          membershipType: 'HANGAROUND',
        })
      )
    ).toEqual(['Per'])
    expect(
      names(
        filterRoster(rows, { ...EMPTY_ROSTER_FILTER, membershipType: 'none' })
      )
    ).toEqual(['Kari'])
  })

  it('filters by role', () => {
    expect(
      names(
        filterRoster(rows, { ...EMPTY_ROSTER_FILTER, role: RoleValues.BARSJEF })
      )
    ).toEqual(['Åse'])
  })

  it('searches the name without case', () => {
    expect(
      names(filterRoster(rows, { ...EMPTY_ROSTER_FILTER, search: ' åS ' }))
    ).toEqual(['Åse'])
  })

  it('does not change the input array', () => {
    const input = Object.freeze([...rows]) as ScheduleRosterNode[]
    expect(() => filterRoster(input, EMPTY_ROSTER_FILTER)).not.toThrow()
  })
})

describe('filter options', () => {
  const rows = [
    row('A', { membershipType: 'hangaround' }),
    row('B', { membershipType: 'gang-member', autofillAs: RoleValues.BARSJEF }),
    row('C', { membershipType: 'hangaround' }),
  ]

  it('lists each membership type on the roster once', () => {
    expect(membershipTypeOptions(rows)).toEqual([
      { value: 'GANG_MEMBER', label: 'Gjengmedlem' },
      { value: 'HANGAROUND', label: 'Hangaround' },
    ])
  })

  it('lists each role on the roster once', () => {
    expect(roleOptions(rows)).toEqual([
      { value: RoleValues.BARSJEF, label: 'Barsjef' },
      { value: RoleValues.BARTENDER, label: 'Bartender' },
    ])
  })
})

describe('positionOptions', () => {
  const group = [
    { id: '2', name: 'Barsjef' },
    { id: '1', name: 'Bartender' },
  ]
  const all = [...group, { id: '3', name: 'Kokk' }]

  it('uses the positions of the internal group when there is one', () => {
    expect(positionOptions(group, all).map(option => option.label)).toEqual([
      'Barsjef',
      'Bartender',
    ])
  })

  it('uses all positions without an internal group', () => {
    expect(positionOptions(null, all)).toEqual([
      { value: '2', label: 'Barsjef' },
      { value: '1', label: 'Bartender' },
      { value: '3', label: 'Kokk' },
    ])
  })
})

describe('groupSyncPreview', () => {
  it('groups the changes by kind in a fixed order and skips empty kinds', () => {
    const groups = groupSyncPreview([
      change('Ola', RosterChangeKindValues.REMOVE),
      change('Kari', RosterChangeKindValues.ADD),
      change('Per', RosterChangeKindValues.CONFLICT),
      change('Anne', RosterChangeKindValues.ADD),
    ])
    expect(
      groups.map(group => [
        group.label,
        group.changes.map(c => c.user.fullName),
      ])
    ).toEqual([
      ['Legges til', ['Anne', 'Kari']],
      ['Fjernes', ['Ola']],
      ['Konflikt', ['Per']],
    ])
  })

  it('is empty without changes', () => {
    expect(groupSyncPreview([])).toEqual([])
  })
})

describe('syncChangeCount', () => {
  it('counts additions, changes and removals, not kept rows or conflicts', () => {
    expect(
      syncChangeCount([
        change('A', RosterChangeKindValues.ADD),
        change('B', RosterChangeKindValues.CHANGE),
        change('C', RosterChangeKindValues.REMOVE),
        change('D', RosterChangeKindValues.KEEP),
        change('E', RosterChangeKindValues.CONFLICT),
      ])
    ).toBe(3)
  })

  it('is 0 without changes', () => {
    expect(syncChangeCount([])).toBe(0)
  })

  it('has a label in singular and plural', () => {
    expect(changeCountLabel(0)).toBe('0 endringer')
    expect(changeCountLabel(1)).toBe('1 endring')
    expect(changeCountLabel(3)).toBe('3 endringer')
  })
})

describe('roster forms', () => {
  const values = {
    role: RoleValues.BARTENDER,
    defaultAvailability: AVAILABLE,
    noCap: false,
    shiftCap: 3,
  }

  it('sends null as the cap when "no cap" is chosen', () => {
    expect(capInput({ noCap: true, shiftCap: 3 })).toBeNull()
    expect(capInput({ noCap: false, shiftCap: 3 })).toBe(3)
  })

  it('starts with the cap when there is one', () => {
    expect(
      rosterFormDefaults(RoleValues.BARSJEF, {
        defaultAvailability: AVAILABLE,
        shiftCap: 2,
      })
    ).toEqual({
      role: RoleValues.BARSJEF,
      defaultAvailability: AVAILABLE,
      noCap: false,
      shiftCap: 2,
    })
  })

  it('needs a user for an entry added by hand', () => {
    expect(
      addEntryFormSchema.safeParse({ ...values, userId: '' }).success
    ).toBe(false)
    expect(
      addEntryFormSchema.safeParse({ ...values, userId: 'user-1' }).success
    ).toBe(true)
  })

  it('starts with "no cap" for a row without a cap', () => {
    expect(
      rosterFormDefaults(RoleValues.BARTENDER, {
        defaultAvailability: OPT_IN,
        shiftCap: null,
      })
    ).toEqual({
      role: RoleValues.BARTENDER,
      defaultAvailability: OPT_IN,
      noCap: true,
      shiftCap: null,
    })
  })

  it('needs a cap unless "no cap" is chosen', () => {
    expect(rosterFormSchema.safeParse(values).success).toBe(true)
    expect(
      rosterFormSchema.safeParse({ ...values, shiftCap: null }).success
    ).toBe(false)
    expect(
      rosterFormSchema.safeParse({ ...values, noCap: true, shiftCap: null })
        .success
    ).toBe(true)
  })

  it('refuses a negative or broken cap', () => {
    expect(
      rosterFormSchema.safeParse({ ...values, shiftCap: -1 }).success
    ).toBe(false)
    expect(
      rosterFormSchema.safeParse({ ...values, shiftCap: 1.5 }).success
    ).toBe(false)
  })

  it('needs a position and a membership type for a new rule', () => {
    expect(
      newRuleFormSchema.safeParse({
        ...values,
        positionId: '',
        positionType: 'HANGAROUND',
      }).success
    ).toBe(false)
    expect(
      newRuleFormSchema.safeParse({
        ...values,
        positionId: 'pos-1',
        positionType: 'HANGAROUND',
      }).success
    ).toBe(true)
  })
})
