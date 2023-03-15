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
          approvedBy {
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
  query AllSociSessions($first: Int, $after: String) {
    allSociSessions(first: $first, after: $after) {
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
          createdAt
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
        getCleanFullName
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

export const ACTIVE_SOCI_ORDER_SESSION = gql`
  query ActiveSociOrderSession {
    activeSociOrderSession {
      id
      status
      createdAt
      createdBy {
        id
        fullName
      }
      closedAt
      closedBy {
        id
        fullName
      }
      invitedUsers {
        id
        fullName
      }
      foodOrders {
        id
        user {
          id
          getCleanFullName
        }
        product {
          id
          name
        }
        amount
      }
      orderPdf
    }
  }
`

export const DEFAULT_SOCI_ORDER_SESSION_DRINK_PRODUCTS = gql`
  query DefaultSociOrderSessionDrinkProducts {
    defaultSociOrderSessionDrinkProducts {
      id
      name
      price
    }
  }
`

export const DEFAULT_SOCI_ORDER_SESSION_FOOD_PRODUCTS = gql`
  query DefaultSociOrderSessionFoodProducts {
    defaultSociOrderSessionFoodProducts {
      id
      name
      price
    }
  }
`

export const MY_SESSION_PRODUCT_ORDERS_QUERY = gql`
  query MySessionProductOrders {
    mySessionProductOrders {
      id
      amount
      product {
        id
        name
        price
      }
    }
  }
`

export const ALL_SOCI_ORDERR_SESSION_DRINK_ORDERS_QUERY = gql`
  query AllSociOrderSessionDrinkOrders {
    allSociOrderSessionDrinkOrders {
      id
      amount
      orderedAt
      user {
        id
        getCleanFullName
      }
      product {
        id
        name
        price
      }
    }
  }
`

export const PRODUCT_ORDERS_BY_ITEM_AND_DATE_QUERY = gql`
  query ProductOrdersByItemAndDate(
    $productId: ID!
    $dateFrom: Date!
    $dateTo: Date!
  ) {
    productOrdersByItemAndDate(
      productId: $productId
      dateFrom: $dateFrom
      dateTo: $dateTo
    ) {
      total
      data {
        day
        sum
      }
    }
  }
`
