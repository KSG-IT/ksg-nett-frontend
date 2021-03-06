import gql from 'graphql-tag'

export const MY_BANK_ACCOUNT_QUERY = gql`
  query MyBankAccount {
    myBankAccount {
      id
      cardUuid
      balance
      lastDeposits {
        id
        amount
        approved
        createdAt
      }
      user {
        lastTransactions {
          name
          amount
          quantity
          timestamp
        }
      }
    }
  }
`

export const ALL_DEPOSITS = gql`
  query AllDeposits($q: String, $unverifiedOnly: Boolean) {
    allDeposits(q: $q, unverifiedOnly: $unverifiedOnly) {
      edges {
        node {
          id
          description
          amount
          receipt
          approved
          createdAt
          account {
            id
            user {
              id
              fullName
              profileImage
            }
          }
          signedOffBy {
            id
            initials
            profileImage
          }
        }
      }
    }
  }
`

export const MY_EXPENDITURES = gql`
  query MyExpenditures($dateRange: TotalExpenditureDateRange) {
    myExpenditures(dateRange: $dateRange) {
      total
      data {
        day
        sum
      }
    }
  }
`
