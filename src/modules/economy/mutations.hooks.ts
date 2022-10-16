import { useMutation } from '@apollo/client'
import {
  CLOSE_SOCI_SESSION_MUTATION,
  CREATE_DEPOSIT_MUTATION,
  CREATE_SOCI_SESSION_MUTATION,
  PLACE_PROUCT_ORDER_MUTATION,
  UNDO_PRODUCT_ORDER_MUTATION,
} from './mutations'
import {
  CloseSociSessionReturns,
  CloseSociSessionVariables,
  CreateDepositMutationReturns,
  CreateSociSessionReturns,
  CreateSociSessionVariables,
  PlaceProductOrderReturns,
  PlaceProductOrderVariables,
  UndoProductOrderReturns,
  UndoProductOrderVariables,
} from './types.graphql'

export function useDepositMutations() {
  const [createDeposit, { loading: createDepositLoading }] =
    useMutation<CreateDepositMutationReturns>(CREATE_DEPOSIT_MUTATION)

  return {
    createDeposit,
    createDepositLoading,
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
