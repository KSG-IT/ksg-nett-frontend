import { gql } from '@apollo/client'

export const CREATE_DEPOSIT = gql`
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
