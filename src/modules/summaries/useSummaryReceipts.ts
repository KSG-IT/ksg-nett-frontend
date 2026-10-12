import { useMutation } from '@apollo/client'
import { useCallback, useEffect, useRef } from 'react'
import {
  OPEN_SUMMARY_MUTATION,
  OpenSummaryReturns,
  READ_SUMMARY_MUTATION,
  ReadSummaryReturns,
  SummaryReceiptVariables,
} from './mutations'

interface SummaryReceiptsInput {
  summaryId: string
  // true once the summary is loaded and shown, not while it is edited
  enabled: boolean
  readByMe: boolean
}

/**
 * Records that the user opened the summary, and gives a function that records
 * that the user read it to the end. The server keeps the first time of each, so
 * a repeated call is harmless. Each call is made once per summary. A failed
 * call is ignored: a missing receipt must not break reading.
 */
export function useSummaryReceipts({
  summaryId,
  enabled,
  readByMe,
}: SummaryReceiptsInput) {
  const [openSummary] = useMutation<
    OpenSummaryReturns,
    SummaryReceiptVariables
  >(OPEN_SUMMARY_MUTATION)
  const [readSummary] = useMutation<
    ReadSummaryReturns,
    SummaryReceiptVariables
  >(READ_SUMMARY_MUTATION)
  const openedId = useRef<string | null>(null)
  const readId = useRef<string | null>(null)

  // Recording a view is a call to the server, so it belongs in an effect.
  useEffect(() => {
    if (!enabled || openedId.current === summaryId) return
    openedId.current = summaryId
    openSummary({ variables: { summaryId }, onError: () => undefined })
  }, [enabled, summaryId, openSummary])

  const markRead = useCallback(() => {
    if (readByMe || readId.current === summaryId) return
    readId.current = summaryId
    readSummary({ variables: { summaryId }, onError: () => undefined })
  }, [readByMe, summaryId, readSummary])

  return { markRead }
}
