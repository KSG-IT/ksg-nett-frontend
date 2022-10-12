import { Button, Group, Tabs } from '@mantine/core'
import { Search } from 'components/Input/Search'
import { useNavigate, useParams } from 'react-router-dom'
import { PopularQuotes } from '../PopularQuotes'

interface QuotesTabsProps {}

export const QuotesTabs: React.FC<QuotesTabsProps> = () => {
  const navigate = useNavigate()
  const { tabValue } = useParams()
  return (
    <Group>
      <Tabs
        variant="pills"
        color={'samfundet-red'}
        value={tabValue}
        onTabChange={value => navigate(`/${value}`)}
      >
        <Tabs.List>
          <Tabs.Tab value="quotes/review">
            <Button variant={'subtle'} color={'samfundet-red'}>
              Innsendt
            </Button>
          </Tabs.Tab>
          <Tabs.Tab value="quotes/popular">Populære</Tabs.Tab>
          <Tabs.Tab value="quotes">Alle</Tabs.Tab>
          <Tabs.Tab value="quotes/create">
            <Button color={'samfundet-red'}>Send inn</Button>
          </Tabs.Tab>
        </Tabs.List>
      </Tabs>
    </Group>
  )
}
