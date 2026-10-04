import { useQuery } from '@apollo/client'
import { Group, MultiSelect, Stack, Title } from '@mantine/core'
import { Breadcrumbs } from 'components/Breadcrumbs'
import { FullPageError } from 'components/FullPageComponents'
import { FullContentLoader } from 'components/Loading'
import { MessageBox } from 'components/MessageBox'
import { useState } from 'react'
import {
  RevenueOverTimeChart,
  RevenuePerProduct,
  SalesSummaryCards,
} from '../components/SociStatistics/SalesCharts'
import {
  SalesPeriodControls,
  useSalesPeriod,
} from '../components/SociStatistics/SalesPeriodControls'
import { SALES_STATISTICS_QUERY, STATISTICS_PRODUCTS_QUERY } from '../queries'
import {
  SalesStatisticsReturns,
  SalesStatisticsVariables,
  StatisticsProductsReturns,
} from '../types.graphql'

const breadcrumbs = [
  { label: 'Hjem', path: '/' },
  { label: 'Økonomi', path: '/economy' },
  { label: 'Salgsstatistikk', path: '/economy/statistics' },
]

export const SociStatistics: React.FC = () => {
  const periodState = useSalesPeriod()
  const { dateFrom, dateTo, granularity, customIncomplete } = periodState
  // Empty: all products with sales in the period (the backend picks them)
  const [picked, setPicked] = useState<string[]>([])

  const products = useQuery<StatisticsProductsReturns>(
    STATISTICS_PRODUCTS_QUERY
  )
  const allProducts = products.data?.allSociProducts ?? []

  const sales = useQuery<SalesStatisticsReturns, SalesStatisticsVariables>(
    SALES_STATISTICS_QUERY,
    {
      variables: {
        productIds: picked.length ? picked : null,
        dateFrom,
        dateTo: dateTo!,
        granularity,
      },
      skip: customIncomplete,
    }
  )

  if (products.error || sales.error)
    return <FullPageError error={products.error ?? sales.error} />

  if (products.loading) return <FullContentLoader />

  const productOptions = allProducts.map(product => ({
    value: product.id,
    label: `${product.icon ?? ''} ${product.name}`.trim(),
  }))
  const salesData = sales.data?.productOrdersByItemAndDateList ?? []
  const hasSales = salesData.some(
    product => product.total !== 0 || product.quantity !== 0
  )

  return (
    <Stack>
      <Breadcrumbs items={breadcrumbs} />
      <Title>Salgsstatistikk</Title>

      <Group align="flex-end" wrap="wrap">
        <SalesPeriodControls state={periodState} />
      </Group>
      <MultiSelect
        label="Produkter"
        placeholder={
          picked.length ? undefined : 'Alle produkter med salg i perioden'
        }
        description={
          picked.length
            ? undefined
            : 'Velg produkter for å se bare dem. Tøm valget for å se alle igjen.'
        }
        data={productOptions}
        value={picked}
        onChange={setPicked}
        searchable
        clearable
        maxDropdownHeight={320}
      />

      {customIncomplete ? (
        <MessageBox type="info">Velg en start- og sluttdato.</MessageBox>
      ) : sales.loading && !sales.data ? (
        <FullContentLoader />
      ) : (
        <>
          <SalesSummaryCards products={salesData} granularity={granularity} />
          {hasSales ? (
            <>
              <RevenueOverTimeChart
                products={salesData}
                granularity={granularity}
              />
              <RevenuePerProduct products={salesData} />
            </>
          ) : (
            <MessageBox type="info">
              {picked.length
                ? 'Ingen salg i perioden for de valgte produktene.'
                : 'Ingen salg i perioden.'}
            </MessageBox>
          )}
        </>
      )}
    </Stack>
  )
}

export default SociStatistics
