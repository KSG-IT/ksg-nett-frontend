import {
  beforeDeadline,
  canRunAutofill,
  countLabel,
  latestRun,
  openUnfilled,
  unfilledReasonLabel,
} from './autofill'
import { RoleValues, UnfilledReasonValues } from './consts'
import type { AutofillRunNode, UnfilledSlotNode } from './types.graphql'

function unfilled(
  id: string,
  datetimeStart: string,
  extra: Partial<NonNullable<UnfilledSlotNode['shiftSlot']>> = {}
): UnfilledSlotNode {
  return {
    reason: UnfilledReasonValues.NO_CANDIDATES,
    candidateCount: 0,
    shiftSlot: {
      id,
      role: RoleValues.BARISTA,
      user: null,
      draft: null,
      shift: { id: `s${id}`, name: 'Vakt', datetimeStart },
      ...extra,
    },
  }
}

function run(id: string, rows: UnfilledSlotNode[] = []): AutofillRunNode {
  return {
    id,
    createdAt: '2026-10-06T12:00:00+00:00',
    createdBy: null,
    draftCount: 3,
    unfilled: rows,
  }
}

describe('unfilledReasonLabel', () => {
  it('gives a Norwegian label for each reason', () => {
    const labels = Object.values(UnfilledReasonValues).map(unfilledReasonLabel)
    expect(labels).toEqual([
      'Ingen på rosteren har rollen',
      'Ingen kan jobbe',
      'Kandidatene har vakt samme dag',
      'Kandidatene har nok vakter den uka',
      'Kandidatene har nådd maks vakter',
    ])
  })
})

describe('latestRun', () => {
  it('is the first run, because the API gives the newest first', () => {
    expect(latestRun([run('2'), run('1')])?.id).toBe('2')
  })

  it('is null without runs', () => {
    expect(latestRun([])).toBeNull()
  })
})

describe('openUnfilled', () => {
  it('keeps the slots that are still empty, earliest shift first', () => {
    const rows = openUnfilled(
      run('1', [
        unfilled('a', '2026-10-13T16:00:00+00:00'),
        unfilled('b', '2026-10-12T16:00:00+00:00'),
      ])
    )
    expect(rows.map(row => row.shiftSlot.id)).toEqual(['b', 'a'])
  })

  it('skips slots that got a user or a draft after the run', () => {
    const rows = openUnfilled(
      run('1', [
        unfilled('a', '2026-10-12T16:00:00+00:00', { user: { id: '1' } }),
        unfilled('b', '2026-10-12T16:00:00+00:00', { draft: { id: 'd' } }),
        unfilled('c', '2026-10-12T16:00:00+00:00'),
      ])
    )
    expect(rows.map(row => row.shiftSlot.id)).toEqual(['c'])
  })

  it('skips slots that were deleted after the run', () => {
    const deleted = { ...unfilled('a', '2026-10-12T16:00:00+00:00') }
    deleted.shiftSlot = null
    expect(openUnfilled(run('1', [deleted]))).toEqual([])
  })

  it('compares the start times as instants, not as text', () => {
    const rows = openUnfilled(
      run('1', [
        unfilled('a', '2026-10-12T17:00:00+02:00'),
        unfilled('b', '2026-10-12T15:30:00+00:00'),
      ])
    )
    expect(rows.map(row => row.shiftSlot.id)).toEqual(['a', 'b'])
  })

  it('does not change the run', () => {
    const rows = [
      unfilled('a', '2026-10-13T16:00:00+00:00'),
      unfilled('b', '2026-10-12T16:00:00+00:00'),
    ]
    const frozen = Object.freeze([...rows])
    openUnfilled(run('1', frozen as UnfilledSlotNode[]))
    expect(frozen.map(row => row.shiftSlot?.id)).toEqual(['a', 'b'])
  })
})

describe('beforeDeadline', () => {
  const period = { deadline: '2026-10-10T20:00:00+00:00' }

  it('is true before the deadline', () => {
    expect(beforeDeadline(period, new Date('2026-10-10T19:59:00Z'))).toBe(true)
  })

  it('is false at and after the deadline', () => {
    expect(beforeDeadline(period, new Date('2026-10-10T20:00:00Z'))).toBe(false)
    expect(beforeDeadline(period, new Date('2026-10-11T08:00:00Z'))).toBe(false)
  })
})

describe('canRunAutofill', () => {
  it('is false for a published period', () => {
    expect(canRunAutofill({ publishedAt: '2026-10-06T12:00:00+00:00' })).toBe(
      false
    )
    expect(canRunAutofill({ publishedAt: null })).toBe(true)
  })
})

describe('countLabel', () => {
  it('uses the singular only for one', () => {
    expect(countLabel(1, 'plass', 'plasser')).toBe('1 plass')
    expect(countLabel(0, 'plass', 'plasser')).toBe('0 plasser')
    expect(countLabel(2, 'plass', 'plasser')).toBe('2 plasser')
  })
})
