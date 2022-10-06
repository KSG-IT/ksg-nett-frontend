import { UserNode } from 'modules/users/types'
import { RelayEdges } from 'types/graphql'

// General typing
export type SociSessionType = 'stilletime' | 'krysseliste' | 'societeten'

// balance typing
export type Liquidity =
  | 'negative' // balance < 0
  | 'neutral' // 0 < balance < 100
  | 'positive' // 100 < balance < 1000
  | 'loaded' // 1000 < balance

// Could be this is not something we want to use
export type TransactionHistoryType =
  | ProductOrderNode
  | TransferNode
  | DepositNode

// Should this be a node? Node is reserved for Relay type queries aren't they?

export enum ExpenditureDateRangeEnum {
  THIS_MONTH = 'THIS_MONTH',
}

export type ExpenditureDay = {
  day: Date
  sum: number
}

export type TotalExpenditure = {
  data: ExpenditureDay[]
  total: number
}
export interface BankAccountActivity {
  name: string
  amount: number
  quantity: number
  timestamp: Date
}

export interface SociProductNode {
  skuNumber: string
  name: string
  price: number
  description: string
  icon: string // emoji string
}

export interface SociBankAccountNode {
  id: string
  user: UserNode
  balance: number
  cardUuid: string
  transactionHistory: TransactionHistoryType[]
}

export interface SociSessionNode {
  name: string
  signedOffBy: UserNode
  type: SociSessionType
  closed: boolean
}

export interface ProductOrderNode {
  product: SociProductNode
  orderSize: number
  source: SociBankAccountNode
  session: SociSessionNode
}

export interface TransferNode {
  source: SociBankAccountNode
  destination: SociBankAccountNode
  amount: number
}

export interface DepositNode {
  id: string
  account: SociBankAccountNode
  description: string
  amount: number
  receipt: string | null // string with image url
  signedOffBy: UserNode | null
  signedOffTime: Date | null
  approved: boolean
  comments: DepositCommentNode[]
  createdAt: Date
}

export interface DepositCommentNode {
  deposit: DepositNode
  user: UserNode
  comment: string
}

// QUERIES

export interface AllDepositsQuery {
  allDeposits: RelayEdges<DepositNode>
}

export interface AllDepositsVariables {
  q: string
  unverifiedOnly: boolean
}

export interface AllProductOrdersQuery {
  allProductOrders: RelayEdges<ProductOrderNode>
}

export interface AllProductOrdersQueryVariables {
  user?: string
}

export interface MyBankAccountReturns {
  myBankAccount: {
    id: string
    balance: number
    cardUuid: string
    lastDeposits: DepositNode[]
    user: {
      lastTransactions: BankAccountActivity[]
    }
  }
}

export interface MyExpendituresReturns {
  myExpenditures: TotalExpenditure
}

export interface MyExpendituresVariables {
  dateRange: ExpenditureDateRangeEnum
}

// Mutation

export interface CreateDepositInput {
  amount: number
  description: string
  receipt: File | null
  onCompletedCallback: () => void
}
export interface CreateDepositMutationVariables {
  input: CreateDepositInput
}

export interface CreateDepositMutationReturns {
  deposit: DepositNode
}

type SociBankAccountInput = {
  cardUuid: string
}

export interface PatchSociBankAccountReturns {
  sociBankAccount: Pick<SociBankAccountNode, 'id'>
}

export interface PatchSociBankAccountVariables {
  id: string
  input: SociBankAccountInput
}
