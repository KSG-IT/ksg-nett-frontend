import { useState, useEffect, useCallback } from 'react'
import styled from 'styled-components'
import { v4 } from 'uuid'
import OutsideClickHandler from 'react-outside-click-handler'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`

const SelectedUsersContainer = styled.div``

const SelectedUsersWorkspace = styled.div``

const DropdownContainer = styled.div``

export const UserMultiSelect: React.VFC = () => {
  return (
    <OutsideClickHandler onOutsideClick={() => {}}>
      <Wrapper>
        <SelectedUsersContainer>
          <SelectedUsersWorkspace></SelectedUsersWorkspace>
          <FontAwesomeIcon icon="chevron-down" size="sm" />
        </SelectedUsersContainer>
        <DropdownContainer></DropdownContainer>
      </Wrapper>
    </OutsideClickHandler>
  )
}
