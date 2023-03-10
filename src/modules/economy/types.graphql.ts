import { UserNode, UserThumbnailProps } from 'modules/users/types'
import { RelayEdges, RelayEdgesWithPageInfo } from 'types/graphql'
import {
  DepositMethodValues,
  SociOrderSessionStatusValues,
  SociProductTypeValues,
} from './enums'

// General typing
export enum SociSessionType {
  SOCIETETEN = 'SOCIETETEN',
  STILLETIME = 'STILLETIME',
  KRYSSELISTE = 'KRYSSELISTE',
}

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
  id: string
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
  id: string
  getNameDisplay: string
  createdBy: Pick<UserNode, 'id' | 'getCleanFullName'>
  createdAt: string
  type: SociSessionType
  closed: boolean
  closedAt: Date
  moneySpent: number
  productOrders: ProductOrderNode[]
}

export interface ProductOrderNode {
  id: string
  product: SociProductNode
  orderSize: number
  source: SociBankAccountNode
  session: SociSessionNode
  cost: number
  purchasedAt: Date
  type: SociProductTypeValues | null
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
  resolvedAmount: number | null
  depositMethod: DepositMethodValues
  approvedBy: UserNode | null
  approvedAt: Date | null
  approved: boolean
  createdAt: Date
}

export interface DepositCommentNode {
  deposit: DepositNode
  user: UserNode
  comment: string
}

export type SociOrderSessionNode = {
  id: string
  status: SociOrderSessionStatusValues
  createdAt: Date
  closedAt: Date | null
  createdBy: UserThumbnailProps
  closedBy: UserThumbnailProps | null
  invitedUsers: UserThumbnailProps[]
  orderPdf: string | null
  foodOrders: SociOrderSessionOrder[]
}

export type SociOrderSessionOrder = {
  id: string
  product: SociProductNode
  amount: number
  orderedAt: string
  user: {
    id: string
    getCleanFullName: string
  }
  session: SociOrderSessionNode
}
// QUERIES

export interface AllDepositsQuery {
  allDeposits: RelayEdges<DepositNode>
}

export interface AllDepositsVariables {
  q: string
  unverifiedOnly: boolean
  first?: number
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
      moneySpent: number
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

export interface AllSociSessionsReturns {
  allSociSessions: RelayEdgesWithPageInfo<SociSessionNode>
}

export interface AllSociSessionsVariables {
  first: number
  after?: string
}

export interface SociSessionReturns {
  sociSession: SociSessionNode
}

export interface AllSociProductsReturns {
  allSociProducts: SociProductNode[]
}

export interface ActiveSociOrderSessionReturns {
  activeSociOrderSession: SociOrderSessionNode | null
}

// type will not be null here
export interface DefaultSociOrderSessionFoodProductsReturns {
  defaultSociOrderSessionFoodProducts: SociProductNode[]
}

// type will not be null here
export interface DefaultSociOrderSessionDrinkProductsReturns {
  defaultSociOrderSessionDrinkProducts: SociProductNode[]
}

export interface MySessionProductOrdersReturns {
  mySessionProductOrders: ProductOrderNode[]
}

// ===== MUTATIONS =====

export interface CreateDepositMutationVariables {
  amount: number
  description: string
  depositMethod: DepositMethodValues
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

export interface CloseSociSessionReturns {
  sociSession: Pick<SociSessionNode, 'id'>
}

export interface CloseSociSessionVariables {
  id: string
}

export interface UndoProductOrderReturns {
  found: boolean
}

export interface UndoProductOrderVariables {
  id: string
}

export interface PlaceProductOrderReturns {
  productOrder: Pick<ProductOrderNode, 'id'>
}
export interface PlaceProductOrderVariables {
  sociSessionId: string
  userId: string
  productId: string
  orderSize: number
  overcharge: boolean
}

export interface CreateSociSessionReturns {
  sociSession: Pick<SociSessionNode, 'id'>
}

type CreateSociSessionInput = {
  name: string | null
  type: Omit<SociSessionType, 'SOCIETETEN'>
  creationDate: string
}
export interface CreateSociSessionVariables {
  input: CreateSociSessionInput
}

export interface ApproveDepositReturns {
  deposit: Pick<DepositNode, 'id'>
}

export interface ApproveDepositVariables {
  depositId: string
  correctedAmount?: number
}

export interface InvalidateDepositReturns {
  deposit: Pick<DepositNode, 'id'>
}

export interface InvalidateDepositVariables {
  depositId: string
}

export interface CreateSociOrderSessionReturns {
  sociOrderSession: Pick<SociOrderSessionNode, 'id'>
}

export interface SociOrderSessionNextStatusReturns {
  sociOrderSession: Pick<SociOrderSessionNode, 'id'>
}

export interface PlaceSociOrderSessionOrderReturns {
  sociOrderSessionOrder: Pick<SociOrderSessionOrder, 'id'>
}

export interface PlaceSociOrderSessionOrderVariables {
  productId: string
  amount: number
}

export interface DeleteSociOrderSessionFoodOrderReturns {
  found: boolean
}

export interface DeleteSociOrderSessionFoodOrderVariables {
  orderId: string
}

export interface InviteUsersToOrderSessionReturns {
  sociOrderSession: Pick<SociOrderSessionNode, 'id'>
}

export interface InviteUsersToOrderSessionVariables {
  users: string[]
}
