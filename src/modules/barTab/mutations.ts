import { gql } from '@apollo/client'

export const CREATE_BAR_TAB_MUTATION = gql`
  mutation CreateBarTabMutation($input: CreateBarTabInput!) {
    createBarTab(input: $input) {
      barTab {
        id
      }
    }
  }
`

export const CREATE_BAR_TAB_ORDER_MUTATION = gql`
  mutation CreateBarTabOrderMutation($input: CreateBarTabOrderInput!) {
    createBarTabOrder(input: $input) {
      barTabOrder {
        id
      }
    }
  }
`

export const DELETE_BAR_TAB_ORDER_MUTATION = gql`
  mutation DeleteBarTabOrderMutation($id: ID!) {
    deleteBarTabOrder(id: $id) {
      found
    }
  }
`

export const LOCK_BAR_TAB_MUTATION = gql`
  mutation LockBarTabMutation {
    lockBarTab {
      barTab {
        id
      }
    }
  }
`

export const GENERATE_PDF_MUTATION = gql`
  mutation GeneratePDF {
    generatePdf {
      ok
    }
  }
`

export const CREATE_INVOICES_MUTATION = gql`
  mutation createInvoices {
    createInvoices {
      invoices {
        id
      }
    }
  }
`

export const DELETE_ACTIVE_BAR_TAB_PDFS_MUTATION = gql`
  mutation DeleteActiveBarTabPDFsMutation {
    deleteActiveBarTabPdfs {
      ok
    }
  }
`

export const SEND_BAR_TAB_INVOICE_EMAIL_MUTATION = gql`
  mutation SendBarTabInvoiceEmailMutation($invoiceId: ID!) {
    sendBarTabInvoiceEmail(invoiceId: $invoiceId) {
      ok
    }
  }
`

export const FINALIZE_BAR_TAB_MUTATION = gql`
  mutation FinalizeBarTabMutation {
    finalizeBarTab {
      barTab {
        id
      }
    }
  }
`
