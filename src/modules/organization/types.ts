export type InternalGroupNode = {
  id: string
  name: string
}

export type InternalGroupPositionNode = {
  id: string
  internalGroup: InternalGroupNode
  name: string
}
