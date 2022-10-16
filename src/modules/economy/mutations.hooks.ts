import { useMutation } from '@apollo/client'
import {
  APPROVE_DEPOSIT_MUTATION,
  CLOSE_SOCI_SESSION_MUTATION,
  CREATE_DEPOSIT_MUTATION,
  CREATE_SOCI_SESSION_MUTATION,
  INVALIDATE_DEPOSIT_MUTATION,
  PLACE_PROUCT_ORDER_MUTATION,
  UNDO_PRODUCT_ORDER_MUTATION,
} from './mutations'
import {
  ApproveDepositReturns,
  ApproveDepositVariables,
  CloseSociSessionReturns,
  CloseSociSessionVariables,
  CreateDepositMutationReturns,
  CreateSociSessionReturns,
  CreateSociSessionVariables,
  InvalidateDepositReturns,
  InvalidateDepositVariables,
  PlaceProductOrderReturns,
  PlaceProductOrderVariables,
  UndoProductOrderReturns,
  UndoProductOrderVariables,
} from './types.graphql'

export function useDepositMutations() {
  const [createDeposit, { loading: createDepositLoading }] =
    useMutation<CreateDepositMutationReturns>(CREATE_DEPOSIT_MUTATION)

  const [approveDeposit, { loading: approveDepositLoading }] = useMutation<
    ApproveDepositReturns,
    ApproveDepositVariables
  >(APPROVE_DEPOSIT_MUTATION)

  const [invalidateDeposit, { loading: invalidateDepositLoading }] =
    useMutation<InvalidateDepositReturns, InvalidateDepositVariables>(
      INVALIDATE_DEPOSIT_MUTATION
    )

  return {
    createDeposit,
    createDepositLoading,
    approveDeposit,
    approveDepositLoading,
    invalidateDeposit,
    invalidateDepositLoading,
  }
}

export function useProductOrderMutations() {
  const [placeProductOrder, { loading: placeProductOrderLoading }] =
    useMutation<PlaceProductOrderReturns, PlaceProductOrderVariables>(
      PLACE_PROUCT_ORDER_MUTATION
    )

  const [undoProductOrder, { loading: undoProductOrderLoading }] = useMutation<
    UndoProductOrderReturns,
    UndoProductOrderVariables
  >(UNDO_PRODUCT_ORDER_MUTATION)

  return {
    placeProductOrder,
    placeProductOrderLoading,
    undoProductOrder,
    undoProductOrderLoading,
  }
}

export function useSociSessionMutations() {
  const [closeSociSession, { loading: closeSociSessionsLoading }] = useMutation<
    CloseSociSessionReturns,
    CloseSociSessionVariables
  >(CLOSE_SOCI_SESSION_MUTATION)

  const [createSociSession, { loading: createSociSessionLoading }] =
    useMutation<CreateSociSessionReturns, CreateSociSessionVariables>(
      CREATE_SOCI_SESSION_MUTATION
    )

  return {
    closeSociSession,
    closeSociSessionsLoading,
    createSociSession,
    createSociSessionLoading,
  }
}
