import { isTodSearch } from './searchKeywords'

describe('isTodSearch', () => {
  it('matches the keywords', () => {
    expect(isTodSearch('tod')).toBe(true)
    expect(isTodSearch('skål')).toBe(true)
    expect(isTodSearch('Nødt')).toBe(true)
    expect(isTodSearch('truth or drink')).toBe(true)
  })

  it('matches the start of a keyword from 3 characters', () => {
    expect(isTodSearch('san')).toBe(true)
    expect(isTodSearch('  skå ')).toBe(true)
  })

  it('does not match short or other text', () => {
    expect(isTodSearch('to')).toBe(false)
    expect(isTodSearch('')).toBe(false)
    expect(isTodSearch('tord')).toBe(false)
    expect(isTodSearch('ola nordmann')).toBe(false)
  })
})
