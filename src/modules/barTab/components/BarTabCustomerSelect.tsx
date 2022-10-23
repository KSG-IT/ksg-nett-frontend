import { useQuery } from '@apollo/client'
import { Select, SelectProps } from '@mantine/core'
import { SHALLOW_ALL_CUSTOMERS_QUERY } from '../queries'
import { ShallowAllCustomersReturns } from '../types.graphql'

interface BarTabCustomerSelectProps
  extends Omit<SelectProps, 'value' | 'onChange' | 'data'> {
  customerId: string
  onSelectCallback: (customerId: string) => void
}

export const BarTabCustomerSelect: React.FC<BarTabCustomerSelectProps> = ({
  customerId,
  onSelectCallback,
  ...props
}) => {
  const { data } = useQuery<ShallowAllCustomersReturns>(
    SHALLOW_ALL_CUSTOMERS_QUERY
  )

  const options =
    data?.allBarTabCustomers.map(customer => ({
      label: customer.name,
      value: customer.id,
    })) ?? []

  return (
    <Select
      value={customerId}
      data={options}
      onChange={onSelectCallback}
      {...props}
    />
  )
}
