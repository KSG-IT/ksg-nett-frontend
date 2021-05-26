import Button from '@material-ui/core/Button'
import styled from 'styled-components'
import { useQuery } from '@apollo/client'
import { ME_QUERY } from 'modules/users/queries'
interface WrapperProps {
  sidebarOpen: boolean
}

const Routes = styled.div``

const Wrapper = styled.div<WrapperProps>`
  display: grid;
  grid-template-columns: clamp(230px, 15.1vw, 360px) 1fr;
  grid-template-rows: 1fr;
  grid-template-areas:
    'sidebar main'
    'sidebar main';
`

const ContentWrapper = styled.div`
  grid-area: main;
  background-color: lightblue;

`

const Sidebar = styled.div`
  width: 100%;
  height: 100vh;
`

const HeaderWrapper = styled.div`
  background-color: blue;
`

const SidebarWrapper = styled.div`
  grid-area: sidebar;
  background-color: green;
`

const MainLayout: React.FC = () => {
  const {loading, error, data } = useQuery(ME_QUERY)

  if (loading) return <span>Loading</span>

  if (error) return <span>Error {error.message}</span>


  console.log(data)

  return (
    <Wrapper sidebarOpen={true}>
      <SidebarWrapper>
        <Sidebar>Sidebar</Sidebar>
      </SidebarWrapper>
      <ContentWrapper>
        <HeaderWrapper>Header</HeaderWrapper>
        <Routes>
            <Button color="default" >Click on me</Button>
            
        </Routes>
      </ContentWrapper>
      {/* <FontAwesomeIcon icon={faMoneyBill} size='1x' color="green"/> */}
    </Wrapper>
  )
}

export default MainLayout
