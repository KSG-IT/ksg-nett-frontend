import { useQuery } from '@apollo/client'
import {
  MultiSelect,
  MultiSelectProps,
  Select,
  SelectProps,
} from '@mantine/core'
import { ALL_SOCI_PRODUCTS } from '../queries'
import { AllSociProductsReturns } from '../types.graphql'
import { useState } from 'react'
import {
  ProductSelectItemComponent,
  ProductSelectLabelComponent,
} from './SociStatistics/ProductSelectItemComponent'

interface MultiProductSelectProps extends Omit<MultiSelectProps, 'data'> {
  products?: string[]
  setProductsCallback?: (products: string[]) => void
}

export const MultiProductSelect: React.FC<MultiProductSelectProps> = ({
  value,
  setProductsCallback,
  products = [],
  ...rest
}) => {
  const [inputValue, setInputValue] = useState('')
  const { data, loading } = useQuery<AllSociProductsReturns>(
    ALL_SOCI_PRODUCTS,
    {
      onCompleted: data => {
        if (data?.allSociProducts) {
          setProductsCallback?.(data.allSociProducts.map(product => product.id))
        }
      },
    }
  )

  const options = data?.allSociProducts.map(product => ({
    icon: product.icon,
    label: product.name,
    description: product.name + ' - ' + product.price + 'kr',
    value: product.id,
  }))

  return (
    <MultiSelect
      itemComponent={ProductSelectItemComponent}
      valueComponent={ProductSelectLabelComponent}
      value={products}
      searchValue={inputValue}
      onSearchChange={setInputValue}
      clearable
      placeholder="Velg produkter"
      onChange={setProductsCallback}
      data={options ?? []}
      {...rest}
    />
  )
}
