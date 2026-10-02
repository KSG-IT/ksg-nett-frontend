import { isNewBuild, parseBuildId } from './version'

describe('parseBuildId', () => {
  it('reads the build id', () => {
    expect(parseBuildId({ buildId: 'abc123' })).toBe('abc123')
  })

  it.each([null, undefined, 'abc', 42, {}, { buildId: '' }, { buildId: 1 }])(
    'returns null for %p',
    data => {
      expect(parseBuildId(data)).toBeNull()
    }
  )
})

describe('isNewBuild', () => {
  it('is true when the deployed build differs', () => {
    expect(isNewBuild('abc', 'def')).toBe(true)
  })

  it('is false for the same build', () => {
    expect(isNewBuild('abc', 'abc')).toBe(false)
  })

  it('is false when the deployed build is unknown', () => {
    expect(isNewBuild('abc', null)).toBe(false)
  })
})
