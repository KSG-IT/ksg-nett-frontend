import { activeLink } from './activeLink'

const links = [
  '/dashboard',
  '/schedules',
  '/schedules/me',
  '/economy',
  '/economy/me',
  '/economy/soci-sessions/live',
  '/feature-flags',
]

describe('activeLink', () => {
  it('matches the path exactly', () => {
    expect(activeLink('/dashboard', links)).toBe('/dashboard')
  })

  it('matches pages below a link', () => {
    expect(activeLink('/schedules/abc/v2', links)).toBe('/schedules')
    expect(activeLink('/economy/deposits/create', links)).toBe('/economy')
  })

  it('takes the longest link that matches', () => {
    expect(activeLink('/schedules/me/history', links)).toBe('/schedules/me')
    expect(activeLink('/economy/soci-sessions/live', links)).toBe(
      '/economy/soci-sessions/live'
    )
  })

  it('does not match a link that is only the start of a word', () => {
    expect(activeLink('/economyreport', links)).toBeNull()
  })

  it('is null when no link matches', () => {
    expect(activeLink('/quotes', links)).toBeNull()
  })
})
