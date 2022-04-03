import { gql } from 'graphql-tag'

export const ALL_INTERNAL_GROUP_POSITIONS = gql`
  query AllInternalGroupPositions {
    allInternalGroupPositions {
      id
      name
    }
  }
`

export const ALL_INTERNAL_GROUPS = gql`
  query AllInternalGroupsQuery {
    allInternalGroups {
      id
      name
    }
  }
`
