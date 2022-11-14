import { useQuery } from '@apollo/client'
import { Box, createStyles } from '@mantine/core'
import { ALL_INTERNAL_GROUPS_QUERY } from 'modules/organization/queries'
import { AllInternalGroupsReturns } from 'modules/organization/types'
import Select from 'react-select'
import { internalGroupToSelectOptions } from 'util/organization'

const useStyles = createStyles(theme => ({
  wrapper: {
    display: 'flex',
    width: '400px',
    position: 'relative',
    backgroundColor: theme.colors.gray[3],
    borderRadius: theme.radius.md,
    margin: 0,
    overflow: 'visible',

    [`@media (max-width: ${theme.breakpoints.xs}px)`]: {
      width: '100%',
    },
  },
}))

interface InternalGroupSelectProps {
  internalGroupId?: string
  fullwidth?: boolean
  width?: string
  withOtherOption?: boolean
  setInternalGroupCallback: (slectedId: string) => void
}

export const InternalGroupSelect: React.FC<InternalGroupSelectProps> = ({
  internalGroupId,
  withOtherOption = false,
  setInternalGroupCallback,
}) => {
  const { classes } = useStyles()
  const { loading, data } = useQuery<AllInternalGroupsReturns>(
    ALL_INTERNAL_GROUPS_QUERY
  )

  const options = internalGroupToSelectOptions(data?.allInternalGroups)
  if (withOtherOption) {
    options.push({ value: 'other', label: 'Annet' })
  }
  const initialValue = options.find(option => option.value == internalGroupId)

  return (
    <Box className={classes.wrapper}>
      <Select
        isLoading={loading}
        defaultValue={initialValue}
        options={options}
        // ToDo: Have groupings for internal and interest group
        onChange={option => option && setInternalGroupCallback(option.value)}
        styles={{ container: () => ({ width: '100%', overflow: 'visible' }) }}
      />
    </Box>
  )
}
