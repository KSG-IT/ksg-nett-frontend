import { RetryLink } from '@apollo/client/link/retry'
import { getMainDefinition } from '@apollo/client/utilities'
import { OperationType, shouldRetryOperation } from './retry'

// Sends a query again after a network error, at most twice, with a short
// random delay (up to 300 ms, then up to 600 ms). See util/retry.ts.
export function createQueryRetryLink(initialDelay = 300) {
  return new RetryLink({
    delay: { initial: initialDelay, max: 2000, jitter: true },
    attempts: (count, operation, error) => {
      const definition = getMainDefinition(operation.query)
      const operationType =
        definition.kind === 'OperationDefinition'
          ? (definition.operation as OperationType)
          : undefined
      return shouldRetryOperation(count, operationType, error)
    },
  })
}
