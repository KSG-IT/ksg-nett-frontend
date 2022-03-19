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
  query AllInternalGroups {
    allInternalGroups {
      id
      name
    }
  }
`

export const ALL_INTEREST_GROUPS = gql`
  query {
    allInterestGroups {
      id
      name
      type
    }
  }
`

export const ALL_INTERNAL_WORK_GROUPS = gql`
  query {
    allInternalWorkGroups {
      name
      id
      groupImage
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
    }
  }
`
