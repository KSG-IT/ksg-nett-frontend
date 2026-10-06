export interface TruthOrDrinkEnabledReturns {
  truthOrDrinkEnabled: boolean
}

export interface TodPlayerNode {
  id: string
  getCleanFullName: string
  profileImage: string | null
  initials: string
  activeInternalGroupPosition: {
    id: string
    internalGroup: { id: string; name: string }
  } | null
}

export interface TodPlayerSearchReturns {
  searchbarUsers: TodPlayerNode[]
}

export interface TodPlayerSearchVariables {
  searchString: string
}

export interface TodInternalGroupsReturns {
  allInternalGroupsByType: { id: string; name: string }[]
}

export interface TodFeedbackEnabledReturns {
  getFeatureFlagByKey: { id: string; enabled: boolean } | null
}
