import { SociOrderSessionNode } from 'modules/economy/types.graphql'
import { QuoteNode } from 'modules/quotes/types.graphql'
import { SummaryNode } from 'modules/summaries'
import { WantedUser } from './components/WantedList'

export interface DashboardDataQueryReturns {
  dashboardData: {
    lastSummaries: Pick<SummaryNode, 'date' | 'type' | 'id'>[]
    lastQuotes: Pick<
      QuoteNode,
      'text' | 'tagged' | 'id' | 'context' | 'sum' | 'semester'
    >[]
    wantedList: WantedUser[]
    sociOrderSession: Pick<SociOrderSessionNode, 'id'> | null
    showNewbies: boolean
    showStockMarketShortcut: boolean
  }
}
