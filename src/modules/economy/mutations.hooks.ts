import { useMutation } from '@apollo/client'
import { DeleteMutationReturns, DeleteMutationVariables } from 'types/graphql'
import {
  APPROVE_DEPOSIT_MUTATION,
  CLOSE_SOCI_SESSION_MUTATION,
  CREATE_DEPOSIT_MUTATION,
  CREATE_SOCI_ORDER_SESSION_MUTATION,
  CREATE_SOCI_SESSION_MUTATION,
  DELETE_DEPOSIT_MUTATION,
  DELETE_SOCI_ORDER_SESSION_FOOD_ORDER_MUTATION,
  INVALIDATE_DEPOSIT_MUTATION,
  INVITE_USERS_TO_ORDER_SESSION_MUTATION,
  PLACE_PROUCT_ORDER_MUTATION,
  PLACE_SOCI_ORDER_SESSION_ORDER_MUTATION,
  SOCI_ORDER_SESSION_NEXT_STATUS_MUTATION,
  UNDO_PRODUCT_ORDER_MUTATION,
} from './mutations'
import {
  ApproveDepositReturns,
  ApproveDepositVariables,
  CloseSociSessionReturns,
  CloseSociSessionVariables,
  CreateDepositMutationReturns,
  CreateSociOrderSessionReturns,
  CreateSociSessionReturns,
  CreateSociSessionVariables,
  DeleteSociOrderSessionFoodOrderReturns,
  DeleteSociOrderSessionFoodOrderVariables,
  InvalidateDepositReturns,
  InvalidateDepositVariables,
  InviteUsersToOrderSessionReturns,
  InviteUsersToOrderSessionVariables,
  PlaceProductOrderReturns,
  PlaceProductOrderVariables,
  PlaceSociOrderSessionOrderReturns,
  PlaceSociOrderSessionOrderVariables,
  SociOrderSessionNextStatusReturns,
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

  const [deleteDeposit, { loading: deleteDepositLoading }] = useMutation<
    DeleteMutationReturns,
    DeleteMutationVariables
  >(DELETE_DEPOSIT_MUTATION)

  return {
    createDeposit,
    createDepositLoading,
    approveDeposit,
    approveDepositLoading,
    invalidateDeposit,
    invalidateDepositLoading,
    deleteDeposit,
    deleteDepositLoading,
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

export function useSociOrderSessionMutations() {
  const [createSociOrderSession, { loading: createSociOrderSessionLoading }] =
    useMutation<CreateSociOrderSessionReturns>(
      CREATE_SOCI_ORDER_SESSION_MUTATION
    )

  const [
    sociOrderSessionNextStatus,
    { loading: sociOrderSessionNextStatusLoading },
  ] = useMutation<SociOrderSessionNextStatusReturns>(
    SOCI_ORDER_SESSION_NEXT_STATUS_MUTATION
  )

  const [
    placeSociOrderSessionOrder,
    { loading: placeSociOrderSessionOrderLoading },
  ] = useMutation<
    PlaceSociOrderSessionOrderReturns,
    PlaceSociOrderSessionOrderVariables
  >(PLACE_SOCI_ORDER_SESSION_ORDER_MUTATION)

  const [
    deleteSociOrderSessionFoodOrder,
    { loading: deleteSociOrderSessionFoodOrderLoading },
  ] = useMutation<
    DeleteSociOrderSessionFoodOrderReturns,
    DeleteSociOrderSessionFoodOrderVariables
  >(DELETE_SOCI_ORDER_SESSION_FOOD_ORDER_MUTATION)

  const [
    inviteUsersToOrderSession,
    { loading: inviteUsersToOrderSessionLoading },
  ] = useMutation<
    InviteUsersToOrderSessionReturns,
    InviteUsersToOrderSessionVariables
  >(INVITE_USERS_TO_ORDER_SESSION_MUTATION)

  return {
    createSociOrderSession,
    createSociOrderSessionLoading,
    placeSociOrderSessionOrder,
    placeSociOrderSessionOrderLoading,
    sociOrderSessionNextStatus,
    sociOrderSessionNextStatusLoading,
    deleteSociOrderSessionFoodOrder,
    deleteSociOrderSessionFoodOrderLoading,
    inviteUsersToOrderSession,
    inviteUsersToOrderSessionLoading,
  }
}
