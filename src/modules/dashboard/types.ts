import { QuoteNode } from 'modules/quotes/types'
import { ShiftLocation, ShiftSlotRole } from 'modules/schedules/consts'
import { SummaryNode } from 'modules/summaries'
import { WantedUser } from './components/WantedList'

/* QUERIES */
export interface DashboardDataQueryReturns {
  dashboardData: {
    lastSummaries: Pick<SummaryNode, 'date' | 'type' | 'id'>[]
    lastQuotes: Pick<QuoteNode, 'text' | 'tagged' | 'id' | 'context'>[]
    wantedList: WantedUser[]
    myUpcomingShifts: {
      role: ShiftSlotRole
      shift: {
        location: ShiftLocation
        datetimeStart: Date
        datetimeEnd: Date
        schedule: {
          name: string
        }
      }
    }[]
  }
}
