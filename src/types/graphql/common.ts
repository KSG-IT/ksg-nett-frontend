export interface RelayPageInfo {
  startCursor?: string
  endCursor: string
  hasNextPage: boolean
  hasPreviousPage?: boolean
  __typename: string
}
export interface RelayNode<NodeType> {
  node: NodeType
  __typename: string
}
export interface RelayEdges<NodeType> {
  edges: RelayNode<NodeType>[]
  pageInfo?: RelayPageInfo
  __typename: string
}
export type RelayEdgesWithPageInfo<NodeType> = Required<RelayEdges<NodeType>>

export interface DeleteMutationVariables {
  id: string
}
export interface DeleteMutationReturns {
  found: boolean
}

export interface PatchMutationVariables<NodeType> {
  id: string
  input: {
    defaultBlockSize: number
    defaultInterviewDuration: string
    defaultPauseDuration: string
    defaultInterviewDayStart: string
    defaultInterviewDayEnd: string
    interviewPeriodStartDate: string
    interviewPeriodEndDate: string
  }
}
