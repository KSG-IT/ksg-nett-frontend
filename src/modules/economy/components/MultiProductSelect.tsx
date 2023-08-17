import { useQuery } from '@apollo/client'
import {
  MultiSelect,
  MultiSelectProps,
  Select,
  SelectProps,
} from '@mantine/core'
import { ALL_SOCI_PRODUCTS, ALL_SOCI_PRODUCTS_WITH_DEFAULT } from '../queries'
import {
  AllSociProductsReturns,
  AllSociProductsWithDefaultReturns,
} from '../types.graphql'
import { useMemo, useState } from 'react'
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
  const { data, loading } = useQuery<AllSociProductsWithDefaultReturns>(
    ALL_SOCI_PRODUCTS_WITH_DEFAULT,
    {
      onCompleted: data => {
        if (data?.allSociProductsWithDefault) {
          const defaultOptions = data.allSociProductsWithDefault.filter(
            product => product.isDefault
          )
          setProductsCallback?.(defaultOptions.map(product => product.id))
        }
      },
    }
  )

  const options = useMemo(
    () =>
      data?.allSociProductsWithDefault.map(product => ({
        icon: product.icon,
        label: product.name,
        description: product.name + ' - ' + product.price + 'kr',
        value: product.id,
      })),
    [data]
  )

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
