// Which failed GraphQL requests the SPA sends again (RetryLink in
// apollo-setup.ts).
//
// Now and then a request never reaches Django: the proxy in front of the
// backend (Varnish) answers 503 without CORS headers, and the browser reports
// a CORS error. The same request works a moment later. A retry hides this.
//
// Only queries are retried. A mutation may have reached the server before the
// connection failed, so sending it again could charge or book twice.

export const MAX_QUERY_ATTEMPTS = 3

export type OperationType = 'query' | 'mutation' | 'subscription'

export function shouldRetryOperation(
  attempt: number,
  operationType: OperationType | undefined,
  error: unknown
) {
  return (
    Boolean(error) && operationType === 'query' && attempt < MAX_QUERY_ATTEMPTS
  )
}
