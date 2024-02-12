import { useQuery } from '@apollo/client'
import { Button, Indicator } from '@mantine/core'
import { Link, LinkProps } from 'react-router-dom'
import { PENDING_QUOTES_QUERY } from '../queries'
import { PendingQuotesReturns } from '../types.graphql'

export const PendingQuotesButton: React.FC<LinkProps> = ({ ...rest }) => {
  const { data } = useQuery<PendingQuotesReturns>(PENDING_QUOTES_QUERY, {
    fetchPolicy: 'network-only',
  })

  const pendingCount = data?.pendingQuotes?.length ?? 0

  if (pendingCount === 0) {
    return (
      <Link {...rest} style={{ overflow: 'visible' }}>
        <Button variant="outline">Innsendt</Button>
      </Link>
    )
  }

  return (
    <Link {...rest} style={{ overflow: 'visible' }}>
      <Indicator label={pendingCount} size={20} zIndex={1}>
        <Button variant="outline">Innsendt</Button>
      </Indicator>
    </Link>
  )
}
