import { UserNode } from 'modules/users/types'
import { RelayEdges } from 'types/graphql'

// General typing
export type SociSessionType = 'stilletime' | 'krysseliste' | 'societeten'

export type TransactionHistoryType =
  | ProductOrderNode
  | TransferNode
  | DepositNode

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
  account: SociBankAccountNode
  description: string
  amount: number
  receipt: string // string with image url
  signOffBy: UserNode
  signedOffTime: Date
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
