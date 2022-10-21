import { useMutation } from '@apollo/client'
import {
  DeleteMutationReturns,
  DeleteMutationVariables,
  OkMutationReturns,
} from 'types/graphql'
import {
  CREATE_BAR_TAB_MUTATION,
  CREATE_BAR_TAB_ORDER_MUTATION,
  CREATE_INVOICES_MUTATION,
  DELETE_ACTIVE_BAR_TAB_PDFS_MUTATION,
  DELETE_BAR_TAB_ORDER_MUTATION,
  FINALIZE_BAR_TAB_MUTATION,
  GENERATE_PDF_MUTATION,
  LOCK_BAR_TAB_MUTATION,
  SEND_BAR_TAB_INVOICE_EMAIL_MUTATION,
} from './mutations'
import {
  CreateBarTabOrderReturns,
  CreateBarTabOrderVariables,
  CreateBarTabReturns,
  CreateBarTabVariables,
  CreateInvoicesReturns,
  GeneratePdfReturns,
  LockBarTabReturns,
  SendInvoiceEmailReturns,
  SendInvoiceEmailVariables,
} from './types.graphql'

export function useBarTabMutations() {
  const [createBarTab, { loading: createBarTabLoading }] = useMutation<
    CreateBarTabReturns,
    CreateBarTabVariables
  >(CREATE_BAR_TAB_MUTATION)

  const [lockBarTab, { loading: lockBarTabLoading }] =
    useMutation<LockBarTabReturns>(LOCK_BAR_TAB_MUTATION)

  const [finalizeBarTab, { loading: finalizeBarTabLoading }] = useMutation(
    FINALIZE_BAR_TAB_MUTATION
  )

  return {
    createBarTab,
    createBarTabLoading,
    lockBarTab,
    lockBarTabLoading,
    finalizeBarTab,
    finalizeBarTabLoading,
  }
}

export function useBarTabOrderMutations() {
  const [createBarTabOrder, { loading: createBarTabOrderLoading }] =
    useMutation<CreateBarTabOrderReturns, CreateBarTabOrderVariables>(
      CREATE_BAR_TAB_ORDER_MUTATION
    )

  const [deleteBarTabOrder, { loading: deleteBarTabOrderLoading }] =
    useMutation<DeleteMutationReturns, DeleteMutationVariables>(
      DELETE_BAR_TAB_ORDER_MUTATION
    )

  return {
    createBarTabOrder,
    createBarTabOrderLoading,
    deleteBarTabOrder,
    deleteBarTabOrderLoading,
  }
}

export function useInvoiceMutations() {
  const [createInvoices, { loading: createInvoicesLoading }] =
    useMutation<CreateInvoicesReturns>(CREATE_INVOICES_MUTATION)

  const [generatePdf, { loading: generatePdfLoading }] =
    useMutation<GeneratePdfReturns>(GENERATE_PDF_MUTATION)

  const [deleteActiveBarTabPdfs, { loading: deleteActiveBarTabPdfsLoading }] =
    useMutation<OkMutationReturns>(DELETE_ACTIVE_BAR_TAB_PDFS_MUTATION)

  const [sendBarTabInvoiceEmail, { loading: sendBarTabInvoiceEmailLoading }] =
    useMutation<SendInvoiceEmailReturns, SendInvoiceEmailVariables>(
      SEND_BAR_TAB_INVOICE_EMAIL_MUTATION
    )

  return {
    createInvoices,
    createInvoicesLoading,
    generatePdf,
    generatePdfLoading,
    deleteActiveBarTabPdfs,
    deleteActiveBarTabPdfsLoading,
    sendBarTabInvoiceEmail,
    sendBarTabInvoiceEmailLoading,
  }
}
