import { FetchResult } from '@apollo/client'

export type OnFormSubmit<FormData, MutationReturns> = (
  data: FormData
) => Promise<FetchResult<MutationReturns>>
