import { gql } from 'graphql-tag'

export const INTERVIEWS_AVAILABLE_FOR_BOOKING_QUERY = gql`
  query InterviewsAvailableForBookingQuery($dayOffset: Int!) {
    interviewsAvailableForBooking(dayOffset: $dayOffset) {
      date
      interviewSlots {
        interviewStart
        interviewIds
      }
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
      priorities {
        internalGroupPosition {
          id
          name
        }
      }
      interview {
        id
        interviewStart
        location {
          id
          name
        }
      }
    }
  }
`