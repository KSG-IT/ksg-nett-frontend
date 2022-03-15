import { gql } from 'graphql-tag'

const INTERNAL_GROUP_PRIORITY_FIELDS = gql`
  fragment InternalGroupPriorityFields on InternalGroupPositionPriorityNode {
    id
    applicant {
      id
      fullName
    }
    internalGroupPriority
    applicantPriority
    internalGroupPosition {
      internalGroup {
        id
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
      currentApplicantUnderDiscussion {
        id
        email
        status
        fullName
        image
        phone
        study
        hometown
        priorities {
          ...InternalGroupPriorityFields
        }
        address
        discussionStart
        discussionEnd
        interview {
          id

          interviewStart
          notes
          discussion
          interviewers {
            id
            profileImage
            initials
          }
          canCommitThreeSemesters
          cannotCommitThreeSemestersDetails
          totalEvaluation
          additionalEvaluationAnswers {
            statement
            answer
          }
          booleanEvaluationAnswers {
            statement
            answer
          }
        }
      }
      firstPicks {
        ...InternalGroupPriorityFields
      }
      availableSecondPicks {
        ...InternalGroupPriorityFields
      }
      availableThirdPicks {
        ...InternalGroupPriorityFields
      }
      processedApplicants {
        ...InternalGroupPriorityFields
      }
    }
  }
`
