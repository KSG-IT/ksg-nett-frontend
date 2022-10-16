import { Card, TextInput, TextInputProps } from '@mantine/core'
import { IconSearch } from '@tabler/icons'
import styled from 'styled-components'

interface SearchProps {
  value: string
  placeholder?: string
  onChange: (value: string) => void
  width: number
  fullwidth?: boolean
  onEnter?: () => void
}

export const Search: React.FC<SearchProps> = ({
  value,
  placeholder = '',
  width,
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
    <TextInput
      style={{ width: `${width}px` }}
      placeholder={placeholder}
      value={value}
      onChange={e => {
        onChange(e.target.value)
      }}
      onKeyDown={handleKeyDown}
      icon={<IconSearch size={16} />}
    />
  )
}
