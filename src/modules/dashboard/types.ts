import { QuoteNode } from 'modules/quotes/types'
import { SummaryNode } from 'modules/summaries'
import { UserNode } from 'modules/users/types'

/* QUERIES */
export interface DashboardDataQueryReturns {
  dashboardData: {
    lastSummaries: Pick<SummaryNode, 'date' | 'type' | 'id'>[]
    lastQuotes: Pick<QuoteNode, 'text' | 'tagged' | 'id' | 'context'>[]
    wantedList: Pick<UserNode, 'balance' | 'fullName' | 'id'>[]
  }
}
