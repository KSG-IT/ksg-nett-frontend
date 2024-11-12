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
        resolvedAmount
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
          approved
          createdAt
          depositMethod
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
          minimumRemainingBalance
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
      minimumRemainingBalance
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

export const SOCI_PRODUCT = gql`
  query SociProduct($id: ID!) {
    sociProduct(id: $id) {
      id
      name
      price
      icon
    }
  }
`

export const PRODUCT_ORDERS_WITHIN_TIME_FRAME = gql`
  query ProductOrdersWithinTimeFrame(
    $productId: ID!
    $timeStart: DateTime
    $timeEnd: DateTime
  ) {
    productOrdersWithinTimeFrame(
      productId: $productId
      timeStart: $timeStart
      timeEnd: $timeEnd
    ) {
      id
      purchasedAt
      cost
      orderSize
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

export const STOCK_MARKET_PRODUCTS_QUERY = gql`
  query StockMarketProducts {
    stockMarketProducts {
      name
      id
      price
      trend
      percentageChange
    }
    lastMarketCrash {
      timestamp
    }
    lastMarketCrash {
      timestamp
    }
  }
`

export const LAST_MARKET_CRASH_QUERY = gql`
  query lastMarketCrash {
    lastMarketCrash {
      timestamp
    }
  }
`

export const STOCK_PRICE_HISTORY_QUERY = gql`
  query StockPriceHistory {
    stockPriceHistory {
      productId
      productName
      dataPoints {
        price
        timestamp
      }
    }
  }
`

export const CURRENT_SEASON_QUERY = gql`
  query CurrentRankSeasonQuery {
    currentRankedSeason {
      isParticipant
      hasRevokedRankedConsent
      placement
      rankedSeason
      seasonEnd
      seasonExpenditure
      seasonStart
      participantCount
      topTen {
        name
        expenditure
      }
    }
  }
`
