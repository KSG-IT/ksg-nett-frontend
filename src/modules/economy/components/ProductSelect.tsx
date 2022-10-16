import { useQuery } from '@apollo/client'
import { Select, SelectProps } from '@mantine/core'
import { ALL_SOCI_PRODUCTS } from '../queries'
import { AllSociProductsReturns } from '../types.graphql'

interface ProductSelectProps extends Omit<SelectProps, 'data'> {
  value?: string
  onChangeCallback: (value: string) => void
}

export const ProductSelect: React.FC<ProductSelectProps> = ({
  value,
  onChangeCallback,
  ...rest
}) => {
  const { data } = useQuery<AllSociProductsReturns>(ALL_SOCI_PRODUCTS)

  const options = data?.allSociProducts.map(product => ({
    label: product.name + ' - ' + product.price + 'kr',
    value: product.id,
  }))

  return (
    <Select
      value={value}
      placeholder="Velg produkt"
      data={options ?? []}
      onChange={onChangeCallback}
      {...rest}
    />
  )
}
