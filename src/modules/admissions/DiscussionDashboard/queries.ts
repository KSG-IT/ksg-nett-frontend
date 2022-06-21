import { gql } from 'graphql-tag'

const INTERNAL_GROUP_PRIORITY_FIELDS = gql`
  fragment InternalGroupPriorityFields on InternalGroupPositionPriorityNode {
    id
    applicant {
      id
      fullName
      interview {
        id
        interviewers {
          id
          fullName
          profileImage
        }
      }
    }
    internalGroupPriority
    applicantPriority
    internalGroupPosition {
      internalGroup {
        id
        name
      }
    }
  }
`
export const ALL_INTERNAL_GROUP_APPLICANT_DATA = gql`
  query AllInternalGroupApplicantData {
    allInternalGroupApplicantData {
      positionsToFill
      currentProgress
      internalGroup {
        id
        name
      }
    }
  }
`

export const INTERNAL_GROUP_DISCUSSION_DATA = gql`
  ${INTERNAL_GROUP_PRIORITY_FIELDS}
  query InternalGroupDiscussionDataQuery($internalGroupId: ID!) {
    internalGroupDiscussionData(internalGroupId: $internalGroupId) {
      internalGroup {
        id
        name
      }
      processedApplicants {
        ...InternalGroupPriorityFields
      }
      applicantsOpenForOtherPositions {
        id
        fullName
        priorities {
          ...InternalGroupPriorityFields
        }
        internalGroupInterests {
          id
          internalGroup {
            id
            name
          }
        }
      }

      applicants {
        id
        fullName
        priorities {
          id
          internalGroupPriority
          internalGroupPosition {
            id
            name
            internalGroup {
              id
              name
            }
          }
        }
      }
    }
  }
`
