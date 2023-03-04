import { gql } from '@apollo/client'

export const ALL_FEATURE_FLAGS = gql`
  query AllFeatureFlags {
    allFeatureFlags {
      id
      name
      enabled
      description
    }
  }
`
