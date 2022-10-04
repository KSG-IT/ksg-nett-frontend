import { QuoteNode } from 'modules/quotes/types'
import { SummaryNode } from 'modules/summaries'
import { WantedUser } from './components/WantedList'

/* QUERIES */
export interface DashboardDataQueryReturns {
  dashboardData: {
    lastSummaries: Pick<SummaryNode, 'date' | 'type' | 'id'>[]
    lastQuotes: Pick<QuoteNode, 'text' | 'tagged' | 'id' | 'context'>[]
    wantedList: WantedUser[]
    myUpcomingShifts: {
      roleDisplay: string
      shift: {
        locationDisplay: string
        datetimeStart: Date
        datetimeEnd: Date
        schedule: {
          name: string
        }
      }
    }[]
  }
}
