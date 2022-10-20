import { UserNode } from 'modules/users/types'
import { BarTabOrderTypeValues, BarTabStatusValues } from './enums'

export type BarTabNode = {
  id: string
  datetimeClosed: string | null
  datetimeOpened: string | null
  datetimeReviewed: string | null
  status: BarTabStatusValues

  createdBy: Pick<UserNode, 'id' | 'fullName' | 'initials' | 'profileImage'>
  openedBy: Pick<UserNode, 'id' | 'fullName' | 'initials' | 'profileImage'>
  reviewedBy: Pick<UserNode, 'id' | 'fullName' | 'initials' | 'profileImage'>

  orders: BarTabProductOrderNode[]
}

export type BarTabCustomerNode = {
  id: string
  name: string
  shortName: string
  email: string
}

export type BarTabProductNode = {
  id: string
  name: string
  price: number
}

export type BarTabInvoiceNode = {
  id: string
  datetimeCreated: string
  datetimeSent: string | null
  datetimeSettled: string | null
  barTab: Pick<BarTabNode, 'id'>
  createdBy: Pick<UserNode, 'id' | 'fullName' | 'initials' | 'profileImage'>
  customer: Pick<BarTabCustomerNode, 'id' | 'name' | 'email'>
  weOwe: number
  theyOwe: number
  amount: number
  pdf: string | null
  emailSent: boolean
}

export type BarTabProductOrderNode = {
  id: string
  quantity: number
  getNameDisplay: string
  product: Pick<BarTabProductNode, 'id' | 'name' | 'price'>
  cost: number
  barTab: Pick<BarTabNode, 'id'>
  customer: Pick<BarTabCustomerNode, 'id' | 'name'>
  reviewed: boolean
  status: BarTabOrderTypeValues
  purchasedWhere: string
}

export type BarTabCustomerData = {
  customer: Pick<BarTabCustomerNode, 'id' | 'email' | 'name'>
  barTab: Pick<BarTabNode, 'id'>
  orders: Pick<
    BarTabProductOrderNode,
    'id' | 'getNameDisplay' | 'product' | 'quantity' | 'cost' | 'purchasedWhere'
  >[]
  summaryData: CustomerBarTabSummaryItem[]
  total: number
  weOwe: number
  debt: number
}

export type CustomerBarTabSummaryItem = {
  identifyingName: string
  total: number
}

// ==== QUERY ====
export interface ActiveBarTabReturns {
  activeBarTab: BarTabNode | null
}

export interface ShallowAllCustomersReturns {
  allBarTabCustomers: Pick<
    BarTabCustomerNode,
    'id' | 'name' | 'email' | 'shortName'
  >[]
}

export interface ShallowAllProductsReturns {
  allBarTabProducts: Pick<BarTabProductNode, 'id' | 'name'>[]
}

export interface BarTabCustomerDataReturns {
  barTabCustomerData: BarTabCustomerData[]
}

export interface ActiveBarTabInvoicesReturns {
  activeBarTab: {
    id: string
    invoices: Pick<
      BarTabInvoiceNode,
      'id' | 'amount' | 'customer' | 'weOwe' | 'theyOwe' | 'pdf' | 'emailSent'
    >[]
  }
}
// ==== MUTATION ====
type CreateBarTabInput = {}

export interface CreateBarTabReturns {
  createBarTab: Pick<BarTabNode, 'id'>
}

export interface CreateBarTabVariables {
  input: CreateBarTabInput
}

export interface CreateBarTabOrderReturns {
  createBarTabOrder: Pick<BarTabProductOrderNode, 'id'>
}

type CreateBarTabOrderInput = {
  product: string
  customer: string
  quantity: number
  barTab: string
}

export interface CreateBarTabOrderVariables {
  input: CreateBarTabOrderInput
}

export interface LockBarTabReturns {
  barTab: Pick<BarTabNode, 'id'>
}

export interface CreateInvoicesReturns {
  invoices: Pick<BarTabInvoiceNode, 'id'>[]
}

export interface GeneratePdfReturns {
  ok: boolean
}

export interface SendInvoiceEmailReturns {
  ok: boolean
}

export interface SendInvoiceEmailVariables {
  invoiceId: string
}
