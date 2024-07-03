import { useQuery } from '@apollo/client'
import { Title } from '@mantine/core'
import { Breadcrumbs } from 'components/Breadcrumbs'
import { FullPageError } from 'components/FullPageComponents'
import { FullContentLoader } from 'components/Loading'
import { ActiveBarTablController } from '../components/BarTabDashboaard'
import { ACTIVE_BAR_TAB_QUERY } from '../queries'
import { ActiveBarTabReturns } from '../types.graphql'
import { createStyles } from '@mantine/emotion'

const breadcrumbsItems = [
  { label: 'Hjem', path: '/dashboard' },
  { label: 'Økonomi', path: '/economy' },
  { label: 'BSF', path: '/bar-tab' },
]

export const BarTabDashboard: React.FC = () => {
  const { classes } = useBarTabDashboardStyles()

  const { data, loading, error } =
    useQuery<ActiveBarTabReturns>(ACTIVE_BAR_TAB_QUERY)

  if (error) return <FullPageError />

  if (loading || !data) return <FullContentLoader />

  const { activeBarTab } = data

  return (
    <div className={classes.wrapper}>
      <Breadcrumbs items={breadcrumbsItems} />
      <Title>BSF</Title>
      <ActiveBarTablController barTab={activeBarTab} />
    </div>
  )
}

const useBarTabDashboardStyles = createStyles(theme => ({
  wrapper: {},
}))
