import { gql } from 'graphql-tag'

export const ACTIVE_ADMISSION_QUERY = gql`
  query ActiveAdmission {
    activeAdmission {
      id
      status
      availableInternalGroupPositionsData {
        availablePositions
        internalGroupPosition {
          id
          name
        }
      }
      applicants {
        id
        email
        status
        fullName
        priorities {
          id
          internalGroupPosition {
            id
            name
          }
        }
      }
    }
  }
`

export const INTERVIEW_SCHEDULE_TEMPLATE = gql`
  query InterviewScheduleTemplateQuery {
    interviewScheduleTemplate {
      id
      interviewPeriodStartDate
      defaultInterviewDayStart
      interviewPeriodEndDate
      defaultInterviewDayEnd
      defaultInterviewDuration
      defaultBlockSize
      defaultPauseDuration
    }
  }
`

export const ALL_INTERVIEW_SCHEDULE_TEMPLATES_QUERY = gql`
  query AllInterviewScheduleTemplates {
    allInterviewScheduleTemplates {
      id
      interviewPeriodStartData
      interviewPeriodEndDate
      defaultInterviewDuration
      defaultBlockSize
      defaultPauseDuration
    }
  }
`

export const ALL_INTERVIEW_LOCATIONS_QUERY = gql`
  query AllInterviewLocations {
    allInterviewLocations {
      id
      name
      availability {
        id
        datetimeFrom
        datetimeTo
      }
    }
  }
`

export const INTERVIEW_CONFIG_QUERY = gql`
  query InterviewConfigQuery {
    allInterviewScheduleTemplates {
      id
      interviewPeriodStartDate
      defaultInterviewDayStart
      interviewPeriodEndDate
      defaultInterviewDayEnd
      defaultInterviewDuration
      defaultBlockSize
      defaultPauseDuration
    }
    allInterviewLocations {
      id
      name
      availability {
        id
        datetimeFrom
        datetimeTo
      }
    }
  }
`

export const INTERVIEW_OVERVIEW_QUERY = gql`
  query InterviewOverviewQuery {
    interviewOverview {
      admissionId
      interviewCount
      interviewDayGroupings {
        date
        locations {
          name
          interviews {
            id
            interviewStart
            interviewEnd
          }
        }
      }
    }
    interviewScheduleTemplate {
      id
      interviewPeriodStartDate
      defaultInterviewDayStart
      interviewPeriodEndDate
      defaultInterviewDayEnd
      defaultInterviewDuration
      defaultBlockSize
      defaultPauseDuration
    }
  }
`

export const APPLICANT_QUERY = gql`
  query ApplicantQuery($id: ID!) {
    applicant(id: $id) {
      id
      email
      status
      firstName
      lastName
      fullName
      image
      phone
      study
      hometown
      address
      canCommitThreeSemesters
      priorities {
        internalGroupPosition {
          id
          name
        }
      }
      interview {
        id
        interviewStart
        notes
        discussion
        totalEvaluation
        location {
          id
          name
          locationDescription
        }
        booleanEvaluationAnswers {
          id
          statement {
            statement
          }
          value
        }
        additionalEvaluationAnswers {
          id
          answer
          statement {
            id
            statement
          }
        }
        interviewers {
          id
          initials
          profileImage
        }
      }
    }
  }
`

export const INTERNAL_GROUPS_ACCEPTING_APPLICANTS = gql`
  query InternalGroupsAcceptingApplicantsQuery {
    internalGroupsAcceptingApplicants {
      id
      name
    }
  }
`

export const INTERVIEW_DETAIL_QUERY = gql`
  query Interview($id: ID!) {
    interview(id: $id) {
      id
      notes
      discussion
      applicant {
        id
        fullName
        canCommitThreeSemesters
        openForOtherPositions
        priorities {
          id
          internalGroupPosition {
            id
            name
          }
        }
      }
      booleanEvaluationAnswers {
        id
        statement {
          statement
        }
        value
      }
      additionalEvaluationAnswers {
        id
        statement {
          statement
        }
        answer
      }
    }
  }
`
