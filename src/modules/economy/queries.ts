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
        moneySpent
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
              initials
            }
          }
          signedOffBy {
            id
            initials
            profileImage
            fullName
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

export const ALL_SOCI_SESSIONS = gql`
  query AllSociSessions {
    allSociSessions {
      pageInfo {
        startCursor
        endCursor
        hasPreviousPage
        hasNextPage
      }
      edges {
        cursor
        node {
          id
          getNameDisplay
          closed
          type
          moneySpent
          createdBy {
            id
            fullName
          }
        }
      }
    }
  }
`

export const SOCI_SESSION_QUERY = gql`
  query SociSession($id: ID!) {
    sociSession(id: $id) {
      id
      getNameDisplay
      closed
      type
      moneySpent
      closedAt
      createdBy {
        id
        fullName
      }
      productOrders {
        id
        cost
        orderSize
        purchasedAt
        source {
          id
          user {
            id
            fullName
          }
        }
        product {
          id
          name
          price
          description
          icon
        }
      }
    }
  }
`

export const ALL_SOCI_PRODUCTS = gql`
  query AllSociProducts {
    allSociProducts {
      id
      name
      price
    }
  }
`
