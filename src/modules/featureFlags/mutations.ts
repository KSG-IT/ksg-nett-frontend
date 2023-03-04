import { gql } from '@apollo/client'

export const TOGGLE_FEATURE_FLAG = gql`
  mutation ToggleFeatureFlag($featureFlagId: ID!) {
    toggleFeatureFlag(featureFlagId: $featureFlagId) {
      featureFlag {
        id
      }
    }
  }
`
