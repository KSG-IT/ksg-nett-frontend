import { useQuery } from '@apollo/client'
import { Select, SelectProps } from '@mantine/core'
import { SHALLOW_ALL_PRODUCTS_QUERY } from '../queries'
import { ShallowAllProductsReturns } from '../types.graphql'

interface BarTabProductSelectProps
  extends Omit<SelectProps, 'value' | 'onChange' | 'data'> {
  productId: string
  onSelectCallback: (productId: string) => void
}

export const BarTabProductSelect: React.FC<BarTabProductSelectProps> = ({
  productId,
  onSelectCallback,
  ...props
}) => {
  const { data } = useQuery<ShallowAllProductsReturns>(
    SHALLOW_ALL_PRODUCTS_QUERY
  )

  const options =
    data?.allBarTabProducts.map(product => ({
      label: product.name,
      value: product.id,
    })) ?? []

  return (
    <Select
      value={productId}
      data={options}
      onChange={onSelectCallback}
      {...props}
    />
  )
}
