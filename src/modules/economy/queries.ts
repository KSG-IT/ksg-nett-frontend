import gql from 'graphql-tag'

export const MY_BANK_ACCOUNT_QUERY = gql`
  query MyBankAccount {
    myBankAccount {
      id
      cardUuid
      balance
      deposits {
        id
        amount
        approved
      }
      user {
        bankAccountActivity {
          name
          amount
          quantity
          timestamp
        }
      }
    }
  }
`
