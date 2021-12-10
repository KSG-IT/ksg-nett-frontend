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
  receipt: string // string with image url
  signedOffBy: UserNode | null
  signedOffTime: Date | null
  approved: boolean
  comments: DepositCommentNode[]
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
    deposits: DepositNode[]
    user: {
      bankAccountActivity: BankAccountActivity[]
    }
  }
}

// Mutation

interface CreateDepositInput {
  amount: number
  description: string
  receipt: File | null
}
export interface CreateDepositMutationVariables {
  input: CreateDepositInput
}

export interface CreateDepositMutationReturns {
  depposit: DepositNode
}
