import styled from 'styled-components'
import { Icon } from 'components/Icon'
import { useAuth } from 'context/Authentication'
import { ZIndexRange } from 'types/enums'
import { Link } from 'react-router-dom'

const Wrapper = styled.header`
  width: 100%;
  height: 80px;
  display: flex;
  flex-direction: row;
  padding: 0 12px;
  align-items: center;
  justify-content: space-between;
  background-color: ${props => props.theme.colors.gray2};
  z-index: ${ZIndexRange.Header};

  ${props => props.theme.media.mobile} {
    background-color: ${props => props.theme.colors.purple};

  }
`

const ToggleSidebarButton = styled.div`
  display: none;
  justify-content: center;
  align-items: center;
  width: 42px;
  aspect-ratio: 1/1;
  background-color: ${props => props.theme.colors.white};
  border-radius: 10px;

  ${props => props.theme.media.mobile} {
    display: flex;
  }
`

const MobileLogo = styled(Link)`
  display: none;
  font-size: 32px;
  font-weight: 600;
  color: white;
  ${props => props.theme.media.mobile} {
    display: flex;
  }
`

interface HeaderProps {
  toggleSidebar: () => void
}

export const Header = ({ toggleSidebar }: HeaderProps) => {
  const user = useAuth()
  return (
    <Wrapper>
      <MobileLogo to="/dashboard">KSG</MobileLogo>
      <input placeholder="Søk etter bruker..."/>
      <ToggleSidebarButton onClick={toggleSidebar}>
        <Icon icon="bars" size="32px" color="black" />
      </ToggleSidebarButton>
    </Wrapper>
  )
}
