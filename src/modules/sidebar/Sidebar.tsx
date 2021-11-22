import styled from 'styled-components'
import { useRenderMobile } from 'util/isMobile'
import { ZIndexRange } from 'types/enums'
import kitLogo from 'assets/images/kit_logo.png'
import { SidebarNav } from './SidebarNav'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100%;

  color: ${props => props.theme.colors.white};;
  background-color: ${props => props.theme.colors.purple};
  z-index: ${ZIndexRange.Sidebar};
  overflow-y: scroll;
`

const SidebarTop = styled.div`
  display: flex;
  flex-direction: row;
  background-color: ${props => props.theme.colors.purple};
  width: 100%;
  height: 80px;
  align-items: center;

  ${props => props.theme.media.mobile} {
    display: none;
  }
`

const SidebarLogo = styled.div`
  width: 75px;
  aspect-ratio: 1/1;
  background-image: url(${kitLogo});
  background-size: cover;
  background-position: 50% 50%;
`

const SidebarTopText = styled.h3`
  margin: 0 0 0 15px;
  display: flex;
  font-weight: 600;
`

const SidebarNavSection = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 20px;
`

interface SidebarProps {
  sidebarOpen: boolean
  toggleSidebarCallback: () => void
}

export const Sidebar = ({ sidebarOpen }: SidebarProps) => {
  const isMobile = useRenderMobile()

  const shouldRenderSidebar = !isMobile || sidebarOpen

  return (
    <div>
      {shouldRenderSidebar && (
        <Wrapper>
          <SidebarTop>
            <SidebarLogo />
            <SidebarTopText>Kafé- og Serveringsgjengen</SidebarTopText>
          </SidebarTop>
          <SidebarNavSection>
            <SidebarNav />
          </SidebarNavSection>
        </Wrapper>
      )}
    </div>
  )
}
