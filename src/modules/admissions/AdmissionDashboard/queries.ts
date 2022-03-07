import { gql } from 'graphql-tag'

export const INTERNAL_GROUPS_ACCEPTING_APPLICANTS = gql`
  query InternalGroupsAcceptingApplicantsQuery {
    internalGroupsAcceptingApplicants {
      id
      name
    }
  }
`

export const VALID_APPLICANTS_QUERY = gql`
  query ValidApplicantsQuery {
    validApplicants {
      id
      fullName
      status
      willBeAdmitted
      priorities {
        id
        internalGroupPriority
        internalGroupPosition {
          name
        }
      }
    }
  }
`
