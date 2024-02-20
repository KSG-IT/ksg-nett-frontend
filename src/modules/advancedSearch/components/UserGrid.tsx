import { useQuery } from '@apollo/client'
import { Button, Container, SimpleGrid } from '@mantine/core'
import { FullPageError } from 'components/FullPageComponents'
import { FullContentLoader } from 'components/Loading'
import { DEFAULT_PAGINATION_SIZE } from 'util/consts'
import { UserCard } from './UserCard'
import { InternalGroupPositionNode } from 'modules/organization/types'
import { FETCH_USERS_ADVANCED_QUERY } from '../queries'
import { useNavigate } from 'react-router-dom'

interface UserGridProps {
  query: string
  status: string[]
  gang: string[]
  verv: string[]
  konto: string
}

export const UserGrid: React.FC<UserGridProps> = ({
  query,
  status,
  gang,
  verv,
  konto,
}) => {
  const { data, error, loading, fetchMore } = useQuery(
    FETCH_USERS_ADVANCED_QUERY,
    {
      variables: {
        query,
        status,
        gang,
        verv,
        konto,
        first: DEFAULT_PAGINATION_SIZE,
      },
      pollInterval: 30000, // 30 seconds
    }
  )

  const navigate = useNavigate()

  if (error) return <FullPageError />

  if (loading || !data) return <FullContentLoader />

  const users = data?.users ?? []
  const hasNextPage = data?.pageInfo.hasNextPage ?? false

  const handleFetchMore = async () => {
    if (typeof data === 'undefined') return

    try {
      await fetchMore({
        variables: {
          first: DEFAULT_PAGINATION_SIZE,
          q: { query, status, gang, verv, konto },
          after: data.pageInfo.endCursor,
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prev

          return {
            users: [...prev.users, ...fetchMoreResult.users],
            pageInfo: fetchMoreResult.pageInfo,
          }
        },
      })
    } catch (error) {
      // This is a thing https://stackoverflow.com/questions/68240884/error-object-inside-catch-is-of-type-unkown
      console.error('Error fetching more users:', error)
      if (!(error instanceof Error)) return
      if (error.name === 'Invariant Violation') return

      throw error
    }
  }

  return (
    <>
      <SimpleGrid
        cols={4}
        breakpoints={[
          { maxWidth: 'lg', cols: 3, spacing: 'md' },
          { maxWidth: 'sm', cols: 1, spacing: 'sm' },
        ]}
      >
        {users.map((user: any) => (
          <UserCard
            user={user}
            key={user.id}
            onClick={() => navigate(`/${user.id}`)}
          />
        ))}
      </SimpleGrid>
      <Container>
        {hasNextPage && (
          <Button
            color="samfundet-red"
            loading={loading}
            onClick={handleFetchMore}
          >
            Hent flere personer
          </Button>
        )}
      </Container>
    </>
  )
}
