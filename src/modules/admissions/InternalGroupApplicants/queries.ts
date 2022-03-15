import { gql } from 'graphql-tag'

export const CORE_APPLICANT_FIELDS = gql`
  fragment CoreApplicantFields on ApplicantNode {
    id
    email
    status
    fullName
    image
    phone
    study
    hometown
    address
    interviewerFromInternalGroup(internalGroupId: $internalGroup)
    interview {
      id
      interviewStart
      interviewers {
        id
        profileImage
        initials
      }
    }
  }
`

export const INTERNAL_GROUP_APPLICANTS_DATA = gql`
  ${CORE_APPLICANT_FIELDS}
  query InternalGroupApplicantsDataQuery($internalGroup: ID!) {
    internalGroupApplicantsData(internalGroup: $internalGroup) {
      internalGroup {
        name
      }
      positionsToFill
      currentProgress
      firstPriorities {
        ...CoreApplicantFields
      }
      secondPriorities {
        ...CoreApplicantFields
      }

      thirdPriorities {
        ...CoreApplicantFields
      }
    }
  }
`
