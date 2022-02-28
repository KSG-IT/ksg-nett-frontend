export type InterviewSlot = {
  interviewStart: Date
  interviewIds: string[]
}

export type AvailableInterviewsDayGrouping = {
  date: Date
  interviewSlots: InterviewSlot[]
}

/* === Query typing === */

export interface InterviewsAvailableForBookingReturns {
  interviewsAvailableForBooking: AvailableInterviewsDayGrouping[]
}

export interface InterviewsAvailableForBookingVariables {
  requestMoreInterviewsOffset: Date
}
