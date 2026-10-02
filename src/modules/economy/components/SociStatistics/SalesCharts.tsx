import { LineChart } from '@mantine/charts'
import {
  Card,
  ColorSwatch,
  Group,
  Progress,
  SimpleGrid,
  Table,
  Text,
  Title,
} from '@mantine/core'
import dayjs from 'dayjs'
import 'dayjs/locale/nb'
import {
  GRANULARITY_LABELS,
  periodRows,
  SalesGranularity,
  salesSummary,
  semesterLabel,
  seriesColor,
} from 'modules/economy/salesStatistics'
import { ProductSales } from 'modules/economy/types.graphql'

export const kr = (value: number) => `${value.toLocaleString('nb-NO')} kr`

interface SalesChartsProps {
  products: ProductSales[]
}

interface GroupedSalesChartsProps extends SalesChartsProps {
  granularity: SalesGranularity
}

const PERIOD_FORMATS: Record<Exclude<SalesGranularity, 'SEMESTER'>, string> = {
  DAY: 'D. MMM',
  WEEK: '[uke fra] D. MMM',
  MONTH: 'MMM YYYY',
}

export const periodLabel = (day: string, granularity: SalesGranularity) =>
  granularity === 'SEMESTER'
    ? semesterLabel(day)
    : dayjs(day).locale('nb').format(PERIOD_FORMATS[granularity])

export const SalesSummaryCards: React.FC<GroupedSalesChartsProps> = ({
  products,
  granularity,
}) => {
  const summary = salesSummary(products)
  const labels = GRANULARITY_LABELS[granularity]
  const stats = [
    { label: 'Omsetning', value: kr(summary.total) },
    {
      label: 'Solgte enheter',
      value: summary.quantity.toLocaleString('nb-NO'),
    },
    {
      label: labels.average,
      value: kr(summary.averagePerSalesPeriod),
      hint: `${summary.salesPeriods} ${labels.periods} med salg`,
    },
  ]

  return (
    <SimpleGrid cols={{ base: 1, sm: 3 }}>
      {stats.map(stat => (
        <Card key={stat.label} withBorder padding="md">
          <Text fz="xs" c="dimmed" tt="uppercase" fw={700}>
            {stat.label}
          </Text>
          <Text fz={28} fw={700} lh={1.2}>
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
  )
}

export const RevenueOverTimeChart: React.FC<GroupedSalesChartsProps> = ({
  products,
  granularity,
}) => {
  const data = periodRows(products).map(row => ({
    ...row,
    day: periodLabel(String(row.day), granularity),
  }))
  const title = {
    DAY: 'per dag',
    WEEK: 'per uke',
    MONTH: 'per måned',
    SEMESTER: 'per semester',
  }

  return (
    <Card withBorder padding="md">
      <Title order={4} mb="md">
        Omsetning {title[granularity]}
      </Title>
      <LineChart
        h={320}
        data={data}
        dataKey="day"
        series={products.map((product, index) => ({
          name: product.productId,
          label: product.name,
          color: seriesColor(index),
        }))}
        curveType="monotone"
        withLegend
        legendProps={{ verticalAlign: 'bottom' }}
        valueFormatter={kr}
        withDots={data.length <= 31}
      />
    </Card>
  )
}

interface RevenuePerProductProps extends SalesChartsProps {
  title?: string
  amountLabel?: string
}

export const RevenuePerProduct: React.FC<RevenuePerProductProps> = ({
  products,
  title = 'Omsetning per produkt',
  amountLabel = 'Omsetning',
}) => {
  const total = products.reduce((sum, product) => sum + product.total, 0)
  // Keep the colour index of each product, so it matches the line chart
  const sold = products
    .map((product, index) => ({ product, color: seriesColor(index) }))
    .filter(({ product }) => product.total !== 0 || product.quantity !== 0)
    .sort((a, b) => b.product.total - a.product.total)
  const unsold = products.length - sold.length

  return (
    <Card withBorder padding="md">
      <Title order={4} mb="sm">
        {title}
      </Title>
      <Table verticalSpacing={6} fz="sm" highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Produkt</Table.Th>
            <Table.Th ta="right">Stk</Table.Th>
            <Table.Th w="35%">Andel</Table.Th>
            <Table.Th ta="right">{amountLabel}</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {sold.map(({ product, color }) => {
            // Refunds can make a product negative; show those as 0 %
            const share =
              total > 0 ? Math.max(0, (product.total / total) * 100) : 0
            return (
              <Table.Tr key={product.productId}>
                <Table.Td style={{ whiteSpace: 'nowrap' }}>
                  <Group gap={8} wrap="nowrap">
                    <ColorSwatch
                      color={`var(--mantine-color-${color.replace('.', '-')})`}
                      size={10}
                    />
                    {product.name}
                  </Group>
                </Table.Td>
                <Table.Td ta="right">
                  {product.quantity.toLocaleString('nb-NO')}
                </Table.Td>
                <Table.Td>
                  <Group gap="xs" wrap="nowrap">
                    <Progress
                      value={share}
                      color={color}
                      size="sm"
                      style={{ flex: 1 }}
                    />
                    <Text fz="xs" c="dimmed" w={36} ta="right">
                      {Math.round(share)} %
                    </Text>
                  </Group>
                </Table.Td>
                <Table.Td ta="right" style={{ whiteSpace: 'nowrap' }}>
                  {kr(product.total)}
                </Table.Td>
              </Table.Tr>
            )
          })}
        </Table.Tbody>
      </Table>
      {unsold > 0 && (
        <Text fz="xs" c="dimmed" mt="xs">
          {unsold} {unsold === 1 ? 'produkt' : 'produkter'} uten salg i perioden
          er ikke med.
        </Text>
      )}
    </Card>
  )
}
