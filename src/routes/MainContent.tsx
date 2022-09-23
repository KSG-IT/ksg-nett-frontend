import MainLayout from 'components/Layout/MainLayout'
import { Outlet } from 'react-router-dom'

const Maincontent = () => {
  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  )
}

export default Maincontent
