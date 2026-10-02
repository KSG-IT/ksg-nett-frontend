import { useQuery } from '@apollo/client'
import { Title } from '@mantine/core'
import { Breadcrumbs } from 'components/Breadcrumbs'
import { FullPageError } from 'components/FullPageComponents'
import { FullContentLoader } from 'components/Loading'
import { BarTabCustomerTable } from '../components/BarTabCustomers'
import { SHALLOW_ALL_CUSTOMERS_QUERY } from '../queries'
import { ShallowAllCustomersReturns } from '../types.graphql'

const breadcrumbsItems = [
  { label: 'Hjem', path: '/dashboard' },
  { label: 'BSF', path: '/bar-tab' },
  { label: 'Andre gjenger', path: '/bartab/customers' },
]

export const BarTabCustomers: React.FC = ({}) => {
  const { data, loading, error } = useQuery<ShallowAllCustomersReturns>(
    SHALLOW_ALL_CUSTOMERS_QUERY
  )

  if (error) return <FullPageError />

  if (loading || !data) return <FullContentLoader />

  const { allBarTabCustomers } = data

  return (
    <div>
      <Breadcrumbs items={breadcrumbsItems} />
      <Title>Andre gjenger</Title>
      <BarTabCustomerTable barTabCustomers={allBarTabCustomers} />
    </div>
  )
}
