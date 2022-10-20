import { gql } from '@apollo/client'

export const ACTIVE_BAR_TAB_QUERY = gql`
  query ActiveBarTabQuery {
    activeBarTab {
      id
      status
      orders {
        id
        getNameDisplay
        purchasedWhere
        customer {
          id
          name
        }
        quantity
        cost
        type
        product {
          id
          name
          price
        }
      }
    }
  }
`

export const SHALLOW_ALL_CUSTOMERS_QUERY = gql`
  query ShallowAllCustomersQuery {
    allBarTabCustomers {
      id
      name
      email
      shortName
    }
  }
`

export const SHALLOW_ALL_PRODUCTS_QUERY = gql`
  query ShallowAllProductsQuery {
    allBarTabProducts {
      id
      name
    }
  }
`

export const BAR_TAB_SUMMARY_DATA_QUERY = gql`
  query BarTabCustomerDataQuery {
    barTabCustomerData {
      customer {
        id
        email
        name
      }
      barTab {
        id
      }
      orders {
        id
        getNameDisplay
        purchasedWhere
        cost
        product {
          id
          name
          price
        }
        quantity
      }
      summaryData {
        identifyingName
        total
      }
      total
      weOwe
      debt
    }
  }
`

export const ACTIVE_BAR_TAB_INVOICES_QUERY = gql`
  query ActiveBarTabInvoicesQuery {
    activeBarTab {
      id
      invoices {
        id
        amount
        theyOwe
        weOwe
        pdf
        emailSent
        customer {
          id
          name
          email
        }
      }
    }
  }
`
