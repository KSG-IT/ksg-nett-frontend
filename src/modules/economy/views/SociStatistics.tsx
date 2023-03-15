import { Button, Card, Group, Paper, Stack, Text, Title } from '@mantine/core'
import { DatePicker } from '@mantine/dates'
import { IconGraph } from '@tabler/icons'
import { format } from 'date-fns'
import { useState } from 'react'
import { ProductSelect } from '../components/ProductSelect'
import { ItemChart } from '../components/SociStatistics/ItemChart'

export const SociStatistics: React.FC = () => {
  const [dateFrom, setDateFrom] = useState<string>(
    format(new Date(), 'yyyy-MM-dd')
  )
  const [dateTo, setDateTo] = useState<string>(format(new Date(), 'yyyy-MM-dd'))
  const [productId, setProductId] = useState<string | undefined>('')

  function handleChangeDateFrom(date: Date) {
    setDateFrom(format(date, 'yyyy-MM-dd'))
  }
  function handleChangeDateTo(date: Date) {
    setDateTo(format(date, 'yyyy-MM-dd'))
  }

  return (
    <Stack>
      <Title order={2}>Statistikk</Title>
      <Card withBorder>
        <Group>
          <DatePicker
            value={new Date(dateFrom)}
            onChange={handleChangeDateFrom}
            withinPortal
          />
          <DatePicker
            placeholder="Velg sluttdato"
            value={new Date(dateTo)}
            onChange={handleChangeDateTo}
            withinPortal
          />
          <ProductSelect
            withinPortal
            value={productId}
            onChangeCallback={setProductId}
          />
        </Group>
      </Card>
      <Card p={'xl'} withBorder>
        {productId ? (
          <ItemChart
            productId={productId}
            dateFrom={dateFrom}
            dateTo={dateTo}
          />
        ) : (
          <Stack align={'center'}>
            <IconGraph stroke={1} size={100} color="lightgray" />
            <Text color="dimmed">Vennligst velg et produkt</Text>
          </Stack>
        )}
      </Card>
    </Stack>
  )
}
