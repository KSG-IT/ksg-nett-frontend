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
  allowedGranularities,
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

export const SociStatistics: React.FC = () => {
  const today = useMemo(() => new Date(), [])
  const [period, setPeriod] = useState<SalesPeriod>('this-semester')
  const [customRange, setCustomRange] = useState<
    [string | null, string | null]
  >([null, null])
  // null: use the default for the length of the period
  const [pickedGranularity, setPickedGranularity] =
    useState<SalesGranularity | null>(null)
  // Empty: all products with sales in the period (the backend picks them)
  const [picked, setPicked] = useState<string[]>([])

  const { dateFrom, dateTo } = periodRange(period, today, customRange)
  const allowed = allowedGranularities(period)
  const granularity =
    pickedGranularity && allowed.includes(pickedGranularity)
      ? pickedGranularity
      : defaultGranularity(period, dateFrom, dateTo)

  const products = useQuery<StatisticsProductsReturns>(
    STATISTICS_PRODUCTS_QUERY
  )
  const allProducts = products.data?.allSociProducts ?? []

  const customIncomplete = period === 'custom' && (!dateFrom || !dateTo)
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
            data={allowed.map(value => ({
              value,
              label: GRANULARITY_LABELS[value].option,
            }))}
            disabled={allowed.length === 1}
            value={granularity}
            onChange={value => setPickedGranularity(value as SalesGranularity)}
            display="flex"
          />
        </Input.Wrapper>
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
