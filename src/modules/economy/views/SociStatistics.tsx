import { Card, Group, SimpleGrid, Stack, Text, Title } from '@mantine/core'
import { DatePickerInput } from '@mantine/dates'
import { IconGraph } from '@tabler/icons-react'
import { startOfMonth } from 'date-fns'
import { format } from 'util/date-fns'
import { useState } from 'react'
import { MultiProductSelect } from '../components/MultiProductSelect'
import { ItemChart } from '../components/SociStatistics/ItemChart'
import { ItemDoughnut } from '../components/SociStatistics/ItemDoughnut'
import { ItemSummary } from '../components/SociStatistics/ItemSummary'
import { Breadcrumbs } from 'components/Breadcrumbs'

export const SociStatistics: React.FC = () => {
  const [dateFrom, setDateFrom] = useState<string>(
    format(startOfMonth(new Date()), 'yyyy-MM-dd')
  )

  const [dateTo, setDateTo] = useState<string>(format(new Date(), 'yyyy-MM-dd'))
  const [productIds, setProductIds] = useState<string[]>([])

  function handleChangeDateFrom(date: Date) {
    setDateFrom(format(date, 'yyyy-MM-dd'))
  }
  function handleChangeDateTo(date: Date) {
    setDateTo(format(date, 'yyyy-MM-dd'))
  }

  return (
    <Stack>
      <Breadcrumbs
        items={[
          { label: 'Hjem', path: '/dashboard' },
          { label: 'Økonomi', path: '/economy' },
          { label: 'Salgsstatistikk', path: '' },
        ]}
      />
      {/* date From and To should be date objects and not strings */}
      <Title order={2}>
        Salgsstatistikk: {dateFrom} - {dateTo}
      </Title>
      <Card withBorder>
        <Group>
          <DatePickerInput
            label="Startdato"
            value={new Date(dateFrom)}
            onChange={handleChangeDateFrom}
            popoverProps={{ withinPortal: true }}
          />
          <DatePickerInput
            label="Sluttdato"
            placeholder="Velg sluttdato"
            value={new Date(dateTo)}
            onChange={handleChangeDateTo}
            popoverProps={{
              withinPortal: true,
            }}
          />
          <MultiProductSelect
            label="Produkter"
            withinPortal
            products={productIds}
            setProductsCallback={setProductIds}
          />
        </Group>
      </Card>
      {productIds.length > 0 ? (
        <Stack>
          <SimpleGrid
            cols={2}
            breakpoints={[
              { maxWidth: 'md', cols: 2, spacing: 'md' },
              { maxWidth: 'sm', cols: 1, spacing: 'sm' },
              { maxWidth: 'xs', cols: 1, spacing: 'sm' },
            ]}
          >
            <Card withBorder>
              <ItemDoughnut
                productIds={productIds}
                dateFrom={dateFrom}
                dateTo={dateTo}
              />
            </Card>
            <Card withBorder>
              <ItemSummary
                productIds={productIds}
                dateFrom={dateFrom}
                dateTo={dateTo}
              />
            </Card>
          </SimpleGrid>
          <Card withBorder>
            <ItemChart
              productIds={productIds}
              dateFrom={dateFrom}
              dateTo={dateTo}
            />
          </Card>
        </Stack>
      ) : (
        <Card p={'xl'} withBorder>
          <Stack align={'center'}>
            <IconGraph stroke={1} size={100} color="lightgray" />
            <Text color="dimmed">Vennligst velg et produkt</Text>
          </Stack>
        </Card>
      )}
    </Stack>
  )
}
