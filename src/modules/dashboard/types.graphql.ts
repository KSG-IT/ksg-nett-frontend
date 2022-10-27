import { QuoteNode } from 'modules/quotes/types.graphql'
import { SummaryNode } from 'modules/summaries'
import { WantedUser } from './components/WantedList'

export type UpcomingShiftNode = {
  roleDisplay: string
  shift: {
    locationDisplay: string
    datetimeStart: Date
    datetimeEnd: Date
    schedule: {
      name: string
    }
  }
}

export interface DashboardDataQueryReturns {
  dashboardData: {
    lastSummaries: Pick<SummaryNode, 'date' | 'type' | 'id'>[]
    lastQuotes: Pick<
      QuoteNode,
      'text' | 'tagged' | 'id' | 'context' | 'sum' | 'semester'
    >[]
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
