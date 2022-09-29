import { IconSearch } from '@tabler/icons'
import styled from 'styled-components'

interface WrapperProps {
  width: string
  fullwidth: boolean
}

const Wrapper = styled.div<WrapperProps>`
  display: flex;
  flex-direction: row;
  width: ${props => (props.fullwidth ? '100%' : props.width)};
  height: 35px;
  border-radius: 10px;
  align-items: center;
  background-color: ${props => props.theme.colors.white};
  padding: 0 5px;
  box-shadow: ${props => props.theme.shadow.default};
  overflow: clip;

  &:focus-within {
    outline: 2px solid ${props => props.theme.colors.purple};
  }
`

const Input = styled.input`
  width: 100%;
  height: 100%;
  outline: none;
  border: none;
`

interface SearchProps {
  value: string
  placeholder?: string

  width?: string
  fullwidth?: boolean

  onChange: (value: string) => void
  onEnter?: () => void
}

export const Search: React.VFC<SearchProps> = ({
  value,
  placeholder = '',

  width = '200px',
  fullwidth = false,

  onChange,
  onEnter = () => {},
}) => {
  const handleKeyDown = (evt: React.KeyboardEvent<HTMLInputElement>) => {
    const { code } = evt

    if (code === 'Enter') {
      onEnter()
    }
  }
  return (
    <Wrapper width={width} fullwidth={fullwidth}>
      <Input
        value={value}
        placeholder={placeholder}
        onChange={evt => {
          onChange(evt.target.value)
        }}
        onKeyDown={handleKeyDown}
      />
      <IconSearch />
    </Wrapper>
  )
}
