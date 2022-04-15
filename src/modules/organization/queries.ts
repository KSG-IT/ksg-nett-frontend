import { gql } from 'graphql-tag'

export const ALL_INTERNAL_GROUP_POSITIONS = gql`
  query AllInternalGroupPositions {
    allInternalGroupPositions {
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
      membershipData {
        internalGroupPositionName
        users {
          id
          fullName
        }
      }
    }
  }
`

export const ALL_INTERNAL_GROUPS_QUERY = gql`
  query allInternalGroupsQuery {
    internalGroups: allInternalGroups(Type: INTERNAL_GROUP) {
      id
      name
      type
      groupIcon
    }
    interestGroups: allInternalGroups(Type: INTEREST_GROUP) {
      id
      name
      type
      groupIcon
    }
  }
`
