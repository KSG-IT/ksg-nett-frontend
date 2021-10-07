import { useState } from 'react'
import AuthProvider from 'context/Authentication'
import { useQuery } from '@apollo/client'
import { ME_QUERY } from 'modules/users/queries'
import {
  BrowserRouter as Router,
  Link,
  Route,
  Redirect,
  useLocation,
  useHistory,
} from 'react-router-dom'
import MainLayout from 'containers/MainLayout'

import { Login } from 'modules/login'
import { PublicRoutes } from './PublicRoutes'
interface LocationState {
  from: {
    pathname: string
  }
}

const Public = () => <h3>This is public content</h3>
const Protected = () => <h3>This is hidden content</h3>

const Bootstrap: React.FC = ({}) => {
  const { loading, error, data } = useQuery(ME_QUERY)

  if (loading) return <span>Loading</span>

  if (error) return <span>Error {error.message}</span>

  const { me } = data

  if (me == null || me === undefined) {
    return <PublicRoutes />
  }
  return (
    <AuthProvider user={me}>
      <Router>
        <MainLayout />
      </Router>
    </AuthProvider>
  )
}

export default Bootstrap
