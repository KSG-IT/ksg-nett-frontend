import { isNotLoggedInError } from './auth'

describe('isNotLoggedInError', () => {
  it('is true when one error is the login message', () => {
    expect(
      isNotLoggedInError([
        { message: 'Something else' },
        { message: 'You are not permitted to view this' },
      ])
    ).toBe(true)
  })

  it('is false for a missing permission', () => {
    expect(
      isNotLoggedInError([{ message: 'You do not have permission to do this' }])
    ).toBe(false)
  })

  it('is false without errors', () => {
    expect(isNotLoggedInError(undefined)).toBe(false)
    expect(isNotLoggedInError([])).toBe(false)
  })
})
