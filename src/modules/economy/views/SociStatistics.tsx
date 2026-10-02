import { useQuery } from '@apollo/client'
import {
  Group,
  Input,
  MultiSelect,
  SegmentedControl,
  Select,
  Stack,
  Title,
} from '@mantine/core'
import { DatePickerInput } from '@mantine/dates'
import { Breadcrumbs } from 'components/Breadcrumbs'
import { FullPageError } from 'components/FullPageComponents'
import { FullContentLoader } from 'components/Loading'
import { MessageBox } from 'components/MessageBox'
import 'dayjs/locale/nb'
import { useMemo, useState } from 'react'
import {
  RevenueOverTimeChart,
  RevenuePerProduct,
  SalesSummaryCards,
} from '../components/SociStatistics/SalesCharts'
import { SALES_STATISTICS_QUERY, STATISTICS_PRODUCTS_QUERY } from '../queries'
import {
  defaultGranularity,
  GRANULARITY_LABELS,
  isoDate,
  periodRange,
  SALES_PERIOD_OPTIONS,
  SalesGranularity,
  SalesPeriod,
} from '../salesStatistics'
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

const granularityOptions = (
  Object.keys(GRANULARITY_LABELS) as SalesGranularity[]
).map(value => ({ value, label: GRANULARITY_LABELS[value].option }))

export const SociStatistics: React.FC = () => {
  const today = useMemo(() => new Date(), [])
  const [period, setPeriod] = useState<SalesPeriod>('this-semester')
  const [customRange, setCustomRange] = useState<
    [string | null, string | null]
  >([null, null])
  // null: use the default for the length of the period
  const [pickedGranularity, setPickedGranularity] =
    useState<SalesGranularity | null>(null)
  // null until the user picks products: then the default products are shown
  const [picked, setPicked] = useState<string[] | null>(null)

  const { dateFrom, dateTo } = periodRange(period, today, customRange)
  const granularity = pickedGranularity ?? defaultGranularity(dateFrom, dateTo)

  const products = useQuery<StatisticsProductsReturns>(
    STATISTICS_PRODUCTS_QUERY
  )
  const allProducts = products.data?.allSociProducts ?? []
  const productIds =
    picked ??
    allProducts.filter(product => product.isDefault).map(product => product.id)

  const customIncomplete = period === 'custom' && (!dateFrom || !dateTo)
  const sales = useQuery<SalesStatisticsReturns, SalesStatisticsVariables>(
    SALES_STATISTICS_QUERY,
    {
      variables: { productIds, dateFrom, dateTo: dateTo!, granularity },
      skip: customIncomplete || productIds.length === 0,
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

  function handlePeriodChange(value: string | null) {
    if (!value) return
    setPeriod(value as SalesPeriod)
    // A new period gets its own default grouping
    setPickedGranularity(null)
  }

  return (
    <Stack>
      <Breadcrumbs items={breadcrumbs} />
      <Title>Salgsstatistikk</Title>

      <Group align="flex-end" wrap="wrap">
        <Select
          label="Periode"
          data={SALES_PERIOD_OPTIONS}
          value={period}
          onChange={handlePeriodChange}
          allowDeselect={false}
          w={200}
        />
        {period === 'custom' && (
          <DatePickerInput
            type="range"
            label="Fra og til"
            placeholder="Velg datoer"
            locale="nb"
            valueFormat="D. MMM YYYY"
            value={customRange}
            onChange={value => {
              setCustomRange(value as [string | null, string | null])
              setPickedGranularity(null)
            }}
            maxDate={isoDate(today)}
            allowSingleDateInRange
            w={280}
          />
        )}
        <Input.Wrapper label="Vis per">
          <SegmentedControl
            data={granularityOptions}
            value={granularity}
            onChange={value => setPickedGranularity(value as SalesGranularity)}
            display="flex"
          />
        </Input.Wrapper>
      </Group>
      <MultiSelect
        label="Produkter"
        placeholder={productIds.length ? undefined : 'Velg produkter'}
        data={productOptions}
        value={productIds}
        onChange={setPicked}
        searchable
        clearable
        maxDropdownHeight={320}
      />

      {productIds.length === 0 ? (
        <MessageBox type="info">
          Velg ett eller flere produkter for å se statistikk.
        </MessageBox>
      ) : customIncomplete ? (
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
              Ingen salg i perioden for de valgte produktene.
            </MessageBox>
          )}
        </>
      )}
    </Stack>
  )
}

export default SociStatistics
