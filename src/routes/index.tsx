import { Dashboard as Bad } from 'modules/dashboard/Dashboard' // TODO: not name it bedge
import Dashboard from 'pages/Dashboard'
import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { useStore } from 'store'
import PublicRoutes from './public-routes'

const FullPage404 = React.lazy(
  () => import('components/FullPageComponents/FullPage404')
)

export const AppRoutes = () => {
  const token = useStore(selector => selector.token)

  console.log(token)
  if (!token) {
    return <PublicRoutes />
  }

  return (
    <Routes>
      <Route path="/dashboard" element={<Dashboard />}>
        <Route index element={<Bad />} />
        <Route path="/dashboard/events" element={<p>Hello Events</p>} />
        <Route path="/dashboard/*" element={<FullPage404 />} />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" />} />
    </Routes>
  )
}
