import { UserNode } from 'modules/users/types'

export type KnightHoodNode = {
  id: string
  user: Pick<UserNode, 'id' | 'getCleanFullName'>
  knightedAt: Date
  description: string
}

export interface AllKnightHoodsQueryReturns {
  allKnighthoods: KnightHoodNode[]
}

export interface AddUserToKnightHoodReturns {
  user: Pick<UserNode, 'id'>
}

export interface AddUserToKnightHoodVariables {
  userId: string
  knightedAt?: string
}
