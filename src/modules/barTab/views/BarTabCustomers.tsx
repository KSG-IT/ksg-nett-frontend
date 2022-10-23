import { useQuery } from '@apollo/client'
import { Button, createStyles, Group, Title } from '@mantine/core'
import { FullPageError } from 'components/FullPageComponents'
import { FullContentLoader } from 'components/Loading'
import { Link } from 'react-router-dom'
import { BarTabCustomerTable } from '../components/BarTabCustomers'
import { SHALLOW_ALL_CUSTOMERS_QUERY } from '../queries'
import { ShallowAllCustomersReturns } from '../types.graphql'

export const BarTabCustomers: React.FC = ({}) => {
  const { classes } = useBarTabCustomersStyles()

  const { data, loading, error } = useQuery<ShallowAllCustomersReturns>(
    SHALLOW_ALL_CUSTOMERS_QUERY
  )

  if (error) return <FullPageError />

  if (loading || !data) return <FullContentLoader />

  const { allBarTabCustomers } = data

  return (
    <div className={classes.wrapper}>
      <Group position="apart">
        <Title>Andre gjenger</Title>
        <Link to="/bar-tab">
          <Button color="samfundet-red">Tilbake</Button>
        </Link>
      </Group>

      <BarTabCustomerTable barTabCustomers={allBarTabCustomers} />
    </div>
  )
}

const useBarTabCustomersStyles = createStyles(theme => ({
  wrapper: {},
}))
