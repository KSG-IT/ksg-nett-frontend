import { useQuery } from '@apollo/client'
import {
  Avatar,
  createStyles,
  Group,
  MantineSize,
  MultiSelect,
  Text,
} from '@mantine/core'
import { IconUser } from '@tabler/icons'
import { UserThumbnail } from 'modules/users/components'
import { ALL_ACTIVE_USERS_SHALLOW_QUERY } from 'modules/users/queries'
import {
  AllUsersShallowQueryReturns,
  AllUsersShallowQueryVariables,
  UserNode,
} from 'modules/users/types'
import { forwardRef, useState } from 'react'
import Select from 'react-select'
import { usersToSelectOption, UserOption } from 'util/user'

interface UserMultiSelectProps {
  users?: string[]
  width?: string
  label?: React.ReactNode
  size?: MantineSize | undefined
  fullwidth?: boolean
  setUsersCallback: (users: string[]) => void
}

export const UserMultiSelect: React.FC<UserMultiSelectProps> = ({
  users = [],
  size,
  label,
  setUsersCallback,
}) => {
  const { classes } = useStyles()
  const [inputValue, setInputValue] = useState('')
  const { data, loading } = useQuery<
    AllUsersShallowQueryReturns,
    AllUsersShallowQueryVariables
  >(ALL_ACTIVE_USERS_SHALLOW_QUERY, { variables: { q: inputValue } })

  const options = usersToSelectOption(data?.allActiveUsers)
  const initialValue = options.filter(option => users.includes(option.value))

  console.log(initialValue)
  return (
    <Select
      className={classes.select}
      closeMenuOnSelect={false}
      isMulti={true}
      isLoading={loading}
      onInputChange={setInputValue}
      defaultValue={initialValue}
      options={options}
      onChange={options =>
        setUsersCallback(options.map(option => option.value))
      }
    />
  )
}

const useStyles = createStyles(theme => ({
  select: {
    width: '100%',
    height: '100%',
  },
}))
