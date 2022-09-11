import { FullPage404 } from 'components/FullPageComponents'
import { Route } from 'react-router-dom'

const ProtectedRoutes = () => {
  return (
    <>
      {/* Events module */}
      <Route path="/events" element={<FullPage404 />} />
      <Route path="/events/eventId" element={<FullPage404 />} />
    </>
  )
}

export default ProtectedRoutes
