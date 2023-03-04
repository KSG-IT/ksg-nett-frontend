export type FeatureFlagNode = {
  id: string
  name: string
  enabled: boolean
  description: string
}

export interface AllFeatureFlagsQuery {
  allFeatureFlags: FeatureFlagNode[]
}

export interface ToggleFeatureFlagVariables {
  featureFlagId: string
}

export interface ToggleFeatureFlagReturns {
  featureFlag: Pick<FeatureFlagNode, 'id'>
}
