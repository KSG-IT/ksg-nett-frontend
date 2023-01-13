import { gql } from '@apollo/client'

export const CREATE_DEPOSIT_MUTATION = gql`
  mutation CreateDeposit($input: CreateDepositInput!) {
    createDeposit(input: $input) {
      deposit {
        id
        account {
          id
          user {
            fullName
          }
        }
      }
    }
  }
`

export const PATCH_DEPOSIT = gql`
  mutation PatchDeposit($id: ID!, $input: PatchDepositInput!) {
    patchDeposit(id: $id, input: $input) {
      deposit {
        id
      }
    }
  }
`

export const PATCH_SOCI_BANK_ACCOUNT = gql`
  mutation PatchSociBankAccount($id: ID!, $input: PatchSociBankAccountInput!) {
    patchSociBankAccount(id: $id, input: $input) {
      sociBankAccount {
        id
      }
    }
  }
`

export const CLOSE_SOCI_SESSION_MUTATION = gql`
  mutation CloseSociSession($id: ID!) {
    closeSociSession(id: $id) {
      sociSession {
        id
      }
    }
  }
`

export const CREATE_SOCI_SESSION_MUTATION = gql`
  mutation CreateSociSession($input: CreateSociSessionInput!) {
    createSociSession(input: $input) {
      sociSession {
        id
      }
    }
  }
`

export const PLACE_PROUCT_ORDER_MUTATION = gql`
  mutation PlaceProductOrder(
    $sociSessionId: ID!
    $userId: ID!
    $productId: ID!
    $orderSize: Int!
  ) {
    placeProductOrder(
      sociSessionId: $sociSessionId
      userId: $userId
      productId: $productId
      orderSize: $orderSize
    ) {
      productOrder {
        id
      }
    }
  }
`

export const UNDO_PRODUCT_ORDER_MUTATION = gql`
  mutation UndoProductOrder($id: ID!) {
    undoProductOrder(id: $id) {
      found
    }
  }
`

export const APPROVE_DEPOSIT_MUTATION = gql`
  mutation ApproveDeposit($depositId: ID!) {
    approveDeposit(depositId: $depositId) {
      deposit {
        id
      }
    }
  }
`

export const INVALIDATE_DEPOSIT_MUTATION = gql`
  mutation InvalidateDeposit($depositId: ID!) {
    invalidateDeposit(depositId: $depositId) {
      deposit {
        id
      }
    }
  }
`

export const CREATE_SOCI_ORDER_SESSION_MUTATION = gql`
  mutation CreateSociOrderSession {
    createSociOrderSession {
      sociOrderSession {
        id
      }
    }
  }
`

export const PLACE_SOCI_ORDER_SESSION_ORDER_MUTATION = gql`
  mutation PlaceSociOrderSessionOrder($productId: ID!, $amount: Int!) {
    placeSociOrderSessionOrder(productId: $productId, amount: $amount) {
      sociOrderSessionOrder {
        id
      }
    }
  }
`

export const SOCI_ORDER_SESSION_NEXT_STATUS_MUTATION = gql`
  mutation SociOrderSessionNextStatus {
    sociOrderSessionNextStatus {
      sociOrderSession {
        id
      }
    }
  }
`

export const DELETE_SOCI_ORDER_SESSION_FOOD_ORDER_MUTATION = gql`
  mutation DeleteSociOrderSessionFoodOrder($orderId: ID!) {
    deleteSociOrderSessionFoodOrder(orderId: $orderId) {
      found
    }
  }
`

export const INVITE_USERS_TO_ORDER_SESSION_MUTATION = gql`
  mutation InviteUsersToOrderSession($users: [ID!]!) {
    inviteUsersToOrderSession(users: $users) {
      sociOrderSession {
        id
      }
    }
  }
`
