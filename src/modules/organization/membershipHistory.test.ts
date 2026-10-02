import {
  MembershipHistoryRow,
  semesterShorthand,
  validateMembershipHistory,
} from './membershipHistory'

const row = (
  dateJoined: string,
  dateEnded: string | null = null,
  inInternalGroup = true
): MembershipHistoryRow => ({ dateJoined, dateEnded, inInternalGroup })

describe('semesterShorthand', () => {
  it('returns V for January to July and H from August', () => {
    expect(semesterShorthand('2023-07-31')).toEqual('V23')
    expect(semesterShorthand('2023-08-01')).toEqual('H23')
    expect(semesterShorthand(null)).toEqual('')
  })
})

describe('validateMembershipHistory', () => {
  it('accepts a timeline where one membership starts when the last ends', () => {
    expect(
      validateMembershipHistory([
        row('2020-01-01', '2021-08-01'),
        row('2021-08-01'),
      ])
    ).toEqual([])
  })

  it('rejects an end date before the start date', () => {
    expect(
      validateMembershipHistory([row('2020-01-01', '2019-01-01')])
    ).toEqual([{ index: 0, message: 'Sluttdato er før startdato' }])
  })

  it('rejects two open internal group memberships', () => {
    const errors = validateMembershipHistory([
      row('2020-01-01'),
      row('2021-01-01'),
    ])
    expect(errors.map(error => error.index)).toEqual([1, 1])
  })

  it('rejects overlapping internal group memberships', () => {
    expect(
      validateMembershipHistory([
        row('2020-01-01', '2021-01-01'),
        row('2020-06-01', '2022-01-01'),
      ])
    ).toEqual([{ index: 1, message: 'Overlapper med verv nummer 1' }])
  })

  it('lets interest group memberships overlap and stay open', () => {
    expect(
      validateMembershipHistory([
        row('2020-01-01'),
        row('2020-06-01', null, false),
      ])
    ).toEqual([])
  })
})
