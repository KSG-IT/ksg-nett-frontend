import MainLayout from 'containers/MainLayout'
import AuthProvider from 'context/Authentication'
import { Toaster } from 'react-hot-toast'
import { BrowserRouter as Router } from 'react-router-dom'
import { useMeQuery, UserNode } from '__generated__/graphql'
import { PublicRoutes } from './PublicRoutes'

const Bootstrap: React.FC = () => {
  const { loading, error, data } = useMeQuery()

  if (loading) return <span>Loading</span>

  if (error) return <span>Error {error.message}</span>

  const { me } = data!

  if (me == null || me === undefined) {
    return <PublicRoutes />
  }
  return (
    <AuthProvider user={me as UserNode}>
      <Router>
        <MainLayout />
        <Toaster />
      </Router>
    </AuthProvider>
  )
}
export default Bootstrap
