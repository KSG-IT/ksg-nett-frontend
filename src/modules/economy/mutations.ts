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
