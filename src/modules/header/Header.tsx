import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useStore } from 'store'
import styled from 'styled-components'
import { ZIndexRange } from 'types/enums'
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

const BreadCrumbs = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;

  ${props => props.theme.media.mobile} {
    display: none;
  }
`

const Crumb = styled.div`
  color: ${props => props.theme.colors.darkGray};
  font-weight: 600;
`

interface HeaderProps {
  toggleSidebar: () => void
}

export const Header = ({ toggleSidebar }: HeaderProps) => {
  const [count, setCounter] = useState(0)
  const user = useStore(state => state.user)!
  const PHONES = import.meta.env.VITE_PHONE as string
  const numbers = PHONES.split(',')

  useEffect(() => {
    if (count > 5 && !user.inRelationship) {
      toast.success(
        `Ring meg :))) ${numbers[Math.floor(Math.random() * numbers.length)]}`,
        { position: 'bottom-center' }
      )
    }
  }, [count])
  return (
    <Wrapper>
      <BreadCrumbs>
        <Crumb>Referater</Crumb>
        <Crumb>
          <FontAwesomeIcon size="sm" icon="chevron-right" />
        </Crumb>
        <Crumb onClick={() => setCounter(count => count + 1)}>
          Styret 11.11.2020
        </Crumb>
      </BreadCrumbs>
      <UserSearch />
      <ToggleSidebarButton onClick={toggleSidebar}>
        <FontAwesomeIcon icon={['fas', 'bars']} size="lg" color="black" />
      </ToggleSidebarButton>
    </Wrapper>
  )
}
