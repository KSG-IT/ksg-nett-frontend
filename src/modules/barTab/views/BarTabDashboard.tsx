import { useQuery } from '@apollo/client'
import { createStyles, Title } from '@mantine/core'
import { FullPageError } from 'components/FullPageComponents'
import { FullContentLoader } from 'components/Loading'
import toast from 'react-hot-toast'
import { ActiveBarTablController } from '../components/BarTabDashboaard'
import { useBarTabMutations } from '../mutations.hooks'
import { ACTIVE_BAR_TAB_QUERY } from '../queries'
import { ActiveBarTabReturns } from '../types.graphql'

export const BarTabDashboard: React.FC = () => {
  const { classes } = useBarTabDashboardStyles()

  const { data, loading, error } =
    useQuery<ActiveBarTabReturns>(ACTIVE_BAR_TAB_QUERY)

  if (error) return <FullPageError />

  if (loading || !data) return <FullContentLoader />

  const { activeBarTab } = data

  return (
    <div className={classes.wrapper}>
      <Title>BSF</Title>
      <ActiveBarTablController barTab={activeBarTab} />
    </div>
  )
}

const useBarTabDashboardStyles = createStyles(theme => ({
  wrapper: {},
}))
