import styled from 'styled-components'
import { ZIndexRange } from 'types/enums'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { UserSearch } from './UserSearch'

const Wrapper = styled.header`
  width: 100%;
  height: 70px;
  display: flex;
  flex-direction: row;
  padding: 0 12px;
  align-items: center;
  justify-content: space-between;
  background-color: ${props => props.theme.colors.white};
  z-index: ${ZIndexRange.Header};
  box-shadow: ${props =>
    props.theme.shadow.default}; //0px 0px 2px rgb(0 0 0 / 20%);

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
  return (
    <Wrapper>
      <MobileLogo to="/dashboard">KSG</MobileLogo>
      <UserSearch />

      <ToggleSidebarButton onClick={toggleSidebar}>
        <FontAwesomeIcon icon={['fas', 'bars']} size="lg" color="black" />
      </ToggleSidebarButton>
    </Wrapper>
  )
}
