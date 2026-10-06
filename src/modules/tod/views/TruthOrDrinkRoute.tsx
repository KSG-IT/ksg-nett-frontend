import { useQuery } from '@apollo/client'
import { FullPage404, FullPageError } from 'components/FullPageComponents'
import { FullContentLoader } from 'components/Loading'
import React, { Suspense, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { POUR_DURATION, PourTransition } from '../components/PourTransition'
import { TRUTH_OR_DRINK_ENABLED_QUERY } from '../queries'
import { TruthOrDrinkEnabledReturns } from '../types.graphql'

const TruthOrDrink = React.lazy(() => import('./TruthOrDrink'))

export interface TodRouteState {
  pour?: boolean
}

// The game is behind the truth_or_drink feature flag. Without it, /tod is a
// normal 404. From the search, a pour plays while the game loads.
export const TruthOrDrinkRoute: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [pouring, setPouring] = useState(
    (location.state as TodRouteState | null)?.pour === true
  )
  const { data, loading, error } = useQuery<TruthOrDrinkEnabledReturns>(
    TRUTH_OR_DRINK_ENABLED_QUERY
  )

  useEffect(() => {
    if (!pouring) return
    const timer = setTimeout(() => {
      setPouring(false)
      // Clear the history state, so a refresh does not pour again.
      navigate(location.pathname, { replace: true, state: null })
    }, POUR_DURATION)
    return () => clearTimeout(timer)
  }, [pouring, navigate, location.pathname])

  const loader = pouring ? null : <FullContentLoader />

  return (
    <>
      <RouteContent
        loading={loading}
        failed={error !== undefined}
        enabled={data?.truthOrDrinkEnabled === true}
        loader={loader}
      />
      {pouring && <PourTransition />}
    </>
  )
}

interface RouteContentProps {
  loading: boolean
  failed: boolean
  enabled: boolean
  loader: React.ReactNode
}

const RouteContent: React.FC<RouteContentProps> = ({
  loading,
  failed,
  enabled,
  loader,
}) => {
  if (failed) return <FullPageError />
  if (loading) return <>{loader}</>
  if (!enabled) return <FullPage404 />
  return (
    <Suspense fallback={loader}>
      <TruthOrDrink />
    </Suspense>
  )
}
