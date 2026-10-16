import { useQuery } from '@apollo/client'
import { CHAT_ENABLED_QUERY } from '../queries'
import { ChatEnabledReturns } from '../types.graphql'

// The chat ships behind the `chat` feature flag.
export function useChatEnabled() {
  const { data, loading } = useQuery<ChatEnabledReturns>(CHAT_ENABLED_QUERY)
  return { enabled: data?.getFeatureFlagByKey?.enabled === true, loading }
}
