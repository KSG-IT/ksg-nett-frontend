import { gql } from '@apollo/client'

export const TRUTH_OR_DRINK_ENABLED_QUERY = gql`
  query TruthOrDrinkEnabled {
    truthOrDrinkEnabled
  }
`

export const TOD_PLAYER_SEARCH_QUERY = gql`
  query TodPlayerSearch($searchString: String) {
    searchbarUsers(searchString: $searchString) {
      id
      getCleanFullName
      profileImage
      initials
      activeInternalGroupPosition {
        id
        internalGroup {
          id
          name
        }
      }
    }
  }
`

export const TOD_INTERNAL_GROUPS_QUERY = gql`
  query TodInternalGroups {
    allInternalGroupsByType(internalGroupType: INTERNAL_GROUP) {
      id
      name
    }
  }
`

// The feedback form works only while the feedback feature flag is on.
export const TOD_FEEDBACK_ENABLED_QUERY = gql`
  query TodFeedbackEnabled {
    getFeatureFlagByKey(key: "feedback") {
      id
      enabled
    }
  }
`
