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

export const GET_APPLICATION_FROM_TOKEN = gql`
  query GetApplicantFromToken($token: String!) {
    getApplicantFromToken(token: $token) {
      id
      email
      status
      firstName
      lastName
      image
      phone
      study
      hometown
      address
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
