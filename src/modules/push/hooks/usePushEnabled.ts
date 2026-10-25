import { useQuery } from '@apollo/client'
import { PUSH_ENABLED_QUERY } from '../queries'
import { PushEnabledReturns } from '../types.graphql'

// Push ships behind the `push_notifications` feature flag.
export function usePushEnabled() {
  const { data, loading } = useQuery<PushEnabledReturns>(PUSH_ENABLED_QUERY)
  return { enabled: data?.getFeatureFlagByKey?.enabled === true, loading }
}
