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
