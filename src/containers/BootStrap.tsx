import { useQuery } from '@apollo/client'
import MainLayout from 'containers/MainLayout'
import { MeQueryReturns, ME_QUERY } from 'modules/users'
import { Toaster } from 'react-hot-toast'
import { BrowserRouter as Router } from 'react-router-dom'
import { useStore } from 'store'
import { PublicRoutes } from './PublicRoutes'

const Bootstrap: React.VFC = () => {
  const { loading, error, data } = useQuery<MeQueryReturns>(ME_QUERY)
  const setUser = useStore(state => state.setUser)

  if (error) return <span>Error {error.message}</span>

  if (loading || data === undefined) return <span>Loading</span>

  const { me } = data
  if (me == null || me === undefined) {
    return <PublicRoutes />
  }
  setUser(me)

  return (
    <Router>
      <MainLayout />
      <Toaster />
    </Router>
  )
}
export default Bootstrap
