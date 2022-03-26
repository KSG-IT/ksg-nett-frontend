import { gql } from 'graphql-tag'

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
