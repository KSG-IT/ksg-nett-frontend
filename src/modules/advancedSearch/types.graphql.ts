import { InternalGroupPositionNode } from 'modules/organization/types'
import { UserNode } from 'modules/users/types'
import { RelayEdgesWithPageInfo } from 'types/graphql'

export interface UserCardNode {
  id: string
  firstName: string
  lastName: string
  profileImage: string
  ksgStatus: string
  activeInternalGroupPosition: Pick<InternalGroupPositionNode, 'id' | 'name'>
  isActive: boolean
  isStaff: boolean
  balance: number
}

export type ShallowQuoteNode = Pick<
  UserNode,
  | 'id'
  | 'firstName'
  | 'lastName'
  | 'profileImage'
  | 'ksgStatus'
  | 'activeInternalGroupPosition'
  | 'isActive'
  | 'isStaff'
  | 'balance'
>

/* ==== QUERY TYPING === */
export interface UserReturns {
  userReturns: RelayEdgesWithPageInfo<ShallowQuoteNode>
}
