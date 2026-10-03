import { useQuery } from '@apollo/client'
import {
  BarChart,
  ChartSeries,
  ChartTooltip,
  ChartTooltipProps,
} from '@mantine/charts'
import { Card, Group, SimpleGrid, Stack, Text, Title } from '@mantine/core'
import { FullPageError } from 'components/FullPageComponents'
import { FullContentLoader } from 'components/Loading'
import { MessageBox } from 'components/MessageBox'
import {
  GRANULARITY_LABELS,
  nonZeroItems,
  periodCount,
  periodRows,
  salesSummary,
  seriesColor,
} from 'modules/economy/salesStatistics'
import { MY_PURCHASES_BY_PERIOD_QUERY } from '../queries'
import {
  MyPurchasesByPeriodReturns,
  MyPurchasesByPeriodVariables,
} from '../types.graphql'
import {
  kr,
  periodLabel,
  RevenuePerProduct,
} from './SociStatistics/SalesCharts'
import {
  SalesPeriodControls,
  useSalesPeriod,
} from './SociStatistics/SalesPeriodControls'

// What I spent, when, and on what. Same periods and grouping as the sales
// statistics, but only my own purchases (myPurchasesByPeriod).
export const MySpending: React.FC = () => {
  const periodState = useSalesPeriod()
  const { dateFrom, dateTo, granularity, customIncomplete } = periodState

  const { data, loading, error } = useQuery<
    MyPurchasesByPeriodReturns,
    MyPurchasesByPeriodVariables
  >(MY_PURCHASES_BY_PERIOD_QUERY, {
    variables: { dateFrom, dateTo: dateTo!, granularity },
    skip: customIncomplete,
  })

  const products = data?.myPurchasesByPeriod ?? []
  const summary = salesSummary(products)
  const labels = GRANULARITY_LABELS[granularity]
  // By amount, not by count: X-BELOP stores the amount in kr as its count
  const topProduct = [...products].sort((a, b) => b.total - a.total)[0]

  const series = products.map((product, index) => ({
    name: product.productId,
    label: product.name,
    color: seriesColor(index),
  }))

  const chartData = periodRows(products).map(row => ({
    ...row,
    day: periodLabel(String(row.day), granularity),
  }))

  return (
    <Stack>
      <Group align="flex-end" wrap="wrap">
        <SalesPeriodControls state={periodState} />
      </Group>

      {error ? (
        <FullPageError error={error} />
      ) : customIncomplete ? (
        <MessageBox type="info">Velg en start- og sluttdato.</MessageBox>
      ) : loading && !data ? (
        <FullContentLoader />
      ) : products.length === 0 ? (
        <MessageBox type="info">Du har ikke kjøpt noe i perioden.</MessageBox>
      ) : (
        <>
          <SimpleGrid cols={{ base: 1, sm: 3 }}>
            {[
              {
                label: 'Brukt',
                value: kr(summary.total),
                hint: `${periodCount(
                  summary.salesPeriods,
                  granularity
                )} med kjøp`,
              },
              {
                label: 'Enheter kjøpt',
                value: summary.quantity.toLocaleString('nb-NO'),
              },
              {
                label: 'Mest brukt på',
                value: topProduct?.name ?? '–',
                hint: topProduct ? kr(topProduct.total) : undefined,
              },
            ].map(stat => (
              <Card key={stat.label} withBorder padding="md">
                <Text fz="xs" c="dimmed" tt="uppercase" fw={700}>
                  {stat.label}
                </Text>
                <Text fz={28} fw={700} lh={1.2} truncate>
                  {stat.value}
                </Text>
                {stat.hint && (
                  <Text fz="xs" c="dimmed">
                    {stat.hint}
                  </Text>
                )}
              </Card>
            ))}
          </SimpleGrid>

          {/* The tooltip of a long list goes below the card, so do not clip it */}
          <Card withBorder padding="md" style={{ overflow: 'visible' }}>
            <Title order={4} mb="md">
              Forbruk per {labels.option.toLowerCase()}
            </Title>
            <BarChart
              h={300}
              data={chartData}
              dataKey="day"
              type="stacked"
              series={series}
              valueFormatter={kr}
              tooltipProps={{
                allowEscapeViewBox: { x: false, y: true },
                wrapperStyle: { zIndex: 10 },
                content: ({ label, payload }) => (
                  <SpendingTooltip
                    label={label}
                    payload={payload}
                    series={series}
                  />
                ),
              }}
              withLegend
              legendProps={{ verticalAlign: 'bottom' }}
            />
          </Card>

          <RevenuePerProduct
            products={products}
            title="Hva har jeg kjøpt"
            amountLabel="Beløp"
          />
        </>
      )}
    </Stack>
  )
}

interface SpendingTooltipProps {
  label: React.ReactNode
  payload: ChartTooltipProps['payload']
  series: ChartSeries[]
}

// Only the products I bought in the period, not a 0 kr line for the rest.
const SpendingTooltip: React.FC<SpendingTooltipProps> = ({
  label,
  payload,
  series,
}) => {
  const items = nonZeroItems(payload)
  if (items.length === 0) return null
  return (
    <ChartTooltip
      label={label}
      payload={items}
      series={series}
      valueFormatter={kr}
    />
  )
}
