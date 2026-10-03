import { MAX_QUERY_ATTEMPTS, shouldRetryOperation } from './retry'

describe('shouldRetryOperation', () => {
  const networkError = new TypeError('Failed to fetch')

  it('retries a query after a network error', () => {
    expect(shouldRetryOperation(1, 'query', networkError)).toBe(true)
  })

  it('retries a query until the last attempt', () => {
    expect(
      shouldRetryOperation(MAX_QUERY_ATTEMPTS - 1, 'query', networkError)
    ).toBe(true)
    expect(
      shouldRetryOperation(MAX_QUERY_ATTEMPTS, 'query', networkError)
    ).toBe(false)
  })

  it('never retries a mutation, which could reach the server twice', () => {
    expect(shouldRetryOperation(1, 'mutation', networkError)).toBe(false)
  })

  it('never retries a subscription', () => {
    expect(shouldRetryOperation(1, 'subscription', networkError)).toBe(false)
  })

  it('does not retry without an error', () => {
    expect(shouldRetryOperation(1, 'query', undefined)).toBe(false)
  })
})
