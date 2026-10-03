import { planStatus, slotStatus } from './schedulesOverview'

describe('planStatus', () => {
  const now = new Date('2026-10-03T12:00:00')

  it('gives the date of the last planned shift and the days until it', () => {
    expect(planStatus('2026-10-23T16:00:00', now)).toEqual({
      label: 'Planlagt til fre 23. okt.',
      days: 20,
      soon: false,
    })
  })

  it('is soon when fewer than 10 days are planned', () => {
    expect(planStatus('2026-10-11T16:00:00', now)?.soon).toBe(true)
  })

  it('is null when no shifts are planned', () => {
    expect(planStatus(null, now)).toBeNull()
  })
})

describe('slotStatus', () => {
  it('counts open slots and the filled share', () => {
    expect(slotStatus({ filled: 62, total: 68 })).toEqual({
      open: 6,
      percent: 91,
    })
  })

  it('is 0 % without slots', () => {
    expect(slotStatus({ filled: 0, total: 0 })).toEqual({ open: 0, percent: 0 })
  })
})
