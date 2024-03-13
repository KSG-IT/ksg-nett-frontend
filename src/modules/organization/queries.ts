import { gql } from 'graphql-tag'

export const ALL_INTERNAL_GROUP_POSITIONS = gql`
  query AllInternalGroupPositions {
    allInternalGroupPositions {
      id
      name
      internalGroup {
        type
      }
    }
  }
`

export const INTERNAL_GROUP_POSITIONS_BY_INTERNAL_GROUP = gql`
  query InternalGroupPositionsByInternalGroup($id: ID!) {
    internalGroupPositionsByInternalGroup(internalGroupId: $id) {
      id
      name
    }
  }
`

export const INTERNAL_GROUP_QUERY = gql`
  query InternalGroup($id: ID!) {
    internalGroup(id: $id) {
      id
      name
      type
      groupImage
      description
      highlightedName
      membershipData {
        internalGroupPositionName
        users {
          id
          initials
          getFullWithNickName
          profileImage
        }
      }
    }
  }
`

export const INTERNAL_GROUP_USER_HIGHLIGHTS_BY_INTERNAL_GROUP_QUERY = gql`
  query InternalGroupUserHighlightsByInternalGroup($internalGroupId: ID!) {
    internalGroupUserHighlightsByInternalGroup(
      internalGroupId: $internalGroupId
    ) {
      id
      image
      occupation
      internalGroup {
        id
        name
      }
      user {
        id
        getFullWithNickName
      }
      description
      archived
    }
  }
`

export const ALL_INTERNAL_GROUPS_QUERY = gql`
  query allInternalGroupsQuery {
    allInternalGroups {
      id
      name
    }
  }
`

export const ALL_INTERNAL_GROUPS_BY_TYPE_QUERY = gql`
  query allInternalGroupsByTypeQuery {
    internalGroups: allInternalGroupsByType(internalGroupType: INTERNAL_GROUP) {
      id
      name
      type
      groupIcon
    }
    interestGroups: allInternalGroupsByType(internalGroupType: INTEREST_GROUP) {
      id
      name
      type
      groupIcon
    }
  }
`
