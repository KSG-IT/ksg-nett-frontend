import { ApolloLink, execute, gql, Observable } from '@apollo/client'
import { createQueryRetryLink } from './retryLink'

// A network that fails `failures` times, then answers.
function flakyNetwork(failures: number) {
  let calls = 0
  const link = new ApolloLink(
    () =>
      new Observable(observer => {
        calls += 1
        if (calls <= failures) {
          observer.error(new TypeError('Failed to fetch'))
        } else {
          observer.next({ data: { ok: true } })
          observer.complete()
        }
      })
  )
  return { link, calls: () => calls }
}

function run(link: ApolloLink, query: string) {
  return new Promise((resolve, reject) => {
    execute(link, { query: gql(query) }).subscribe({
      next: resolve,
      error: reject,
    })
  })
}

describe('createQueryRetryLink', () => {
  it('sends a failed query again until it works', async () => {
    const network = flakyNetwork(2)
    const link = createQueryRetryLink(1).concat(network.link)

    await expect(run(link, 'query Dashboard { ok }')).resolves.toEqual({
      data: { ok: true },
    })
    expect(network.calls()).toBe(3)
  })

  it('gives up after three attempts', async () => {
    const network = flakyNetwork(5)
    const link = createQueryRetryLink(1).concat(network.link)

    await expect(run(link, 'query Dashboard { ok }')).rejects.toThrow(
      'Failed to fetch'
    )
    expect(network.calls()).toBe(3)
  })

  it('sends a failed mutation only once', async () => {
    const network = flakyNetwork(1)
    const link = createQueryRetryLink(1).concat(network.link)

    await expect(run(link, 'mutation Charge { ok }')).rejects.toThrow(
      'Failed to fetch'
    )
    expect(network.calls()).toBe(1)
  })
})
