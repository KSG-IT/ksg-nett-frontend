import { gql } from '@apollo/client'
import { InterestChoices } from './types'

const MOCK_SHIFTS_MAP: Record<
  string,
  {
    id: number
    location: string
    timeDisplay: string
    name?: string
    interest: InterestChoices
  }[]
> = {
  ['2025-1-31']: [
    {
      id: 1,
      location: 'Strossa',
      timeDisplay: '21:00 - 03:00',
      interest: InterestChoices.WANT_TO_WORK,
    },
    {
      id: 2,
      location: 'Selskapssiden',
      timeDisplay: '21:00 - 03:00',
      interest: InterestChoices.CANNOT_WORK,
    },
  ],
  ['2025-2-1']: [
    {
      id: 1,
      location: 'Strossa',
      timeDisplay: '21:00 - 03:00',
      interest: InterestChoices.CAN_WORK,
    },
    {
      id: 2,
      location: 'Selskapssiden',
      name: 'Fredag sent',
      timeDisplay: '21:00 - 03:00',
      interest: InterestChoices.CAN_WORK,
    },
    {
      id: 3,
      location: 'Vuelie',
      name: 'Fredag sent',
      timeDisplay: '21:00 - 03:00',
      interest: InterestChoices.CAN_WORK,
    },
  ],
  ['2025-2-7']: [
    {
      id: 1,
      location: 'Strossa',
      timeDisplay: '21:00 - 03:00',
      interest: InterestChoices.CAN_WORK,
    },
    {
      id: 2,
      location: 'Selskapssiden',
      timeDisplay: '21:00 - 03:00',
      interest: InterestChoices.WANT_TO_WORK,
    },
  ],
  ['2025-2-5']: [
    {
      id: 2,
      location: 'Strossa',
      name: 'Sangria tidlig',
      timeDisplay: '17:00 - 21:00',
      interest: InterestChoices.WANT_TO_WORK,
    },
    {
      id: 2,
      location: 'Strossa',
      name: 'Sangria sent',
      timeDisplay: '21:00 - 02:00',
      interest: InterestChoices.CANNOT_WORK,
    },
  ],
  ['2025-2-8']: [
    {
      id: 1,
      location: 'Strossa',
      timeDisplay: '21:00 - 03:00',
      interest: InterestChoices.CANNOT_WORK,
    },
    {
      id: 2,
      location: 'Selskapssiden',
      timeDisplay: '21:00 - 03:00',
      interest: InterestChoices.CANNOT_WORK,
    },
  ],
}

export function useGetShiftInterestsByRosterId({
  rosterId,
  fromDate,
  toDate,
}: {
  rosterId: string
  fromDate: Date
  toDate: Date
}) {
  return MOCK_SHIFTS_MAP
}

const QUERY = gql`
  query GetShiftInterestDataByRosterId {
    getShiftInterestDataByRosterId {
      id
    }
  }
`
