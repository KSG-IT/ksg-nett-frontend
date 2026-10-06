import { gql } from '@apollo/client'

// The fields of DayShift (allShifts.ts), for the shifts page and Mine vakter.
export const DAY_SHIFT_FIELDS = gql`
  fragment DayShiftFields on ShiftNode {
    id
    name
    location
    datetimeStart
    datetimeEnd
    schedule {
      id
      name
    }
    slots {
      id
      role
      user {
        id
        initials
        firstName
        getFullWithNickName
        getCleanFullName
        profileImage
      }
    }
  }
`

export const MY_UPCOMING_SHIFTS = gql`
  query MyUpcomingShifts {
    myUpcomingShifts {
      id
      location
      name
      filledSlots {
        id
        role
        user {
          id
          initials
          firstName
          getFullWithNickName
          profileImage
        }
      }

      datetimeStart
      datetimeEnd
    }
  }
`

export const MY_SHIFTS_UPCOMING = gql`
  ${DAY_SHIFT_FIELDS}
  query MyShiftsUpcoming {
    myUpcomingShifts {
      ...DayShiftFields
    }
  }
`

export const MY_SHIFTS_PAST = gql`
  ${DAY_SHIFT_FIELDS}
  query MyShiftsPast {
    allMyShifts {
      ...DayShiftFields
    }
  }
`

export const ALL_SCHEDULES = gql`
  query AllSchedules {
    allSchedules {
      id
      name
    }
  }
`

export const SCHEDULES_OVERVIEW_QUERY = gql`
  query SchedulesOverview {
    allSchedules {
      id
      name
      canManage
      internalGroup {
        id
        name
      }
      plannedUntil
      upcomingSlots {
        filled
        total
      }
      recentLocations
    }
  }
`

export const SCHEDULE_V2_QUERY = gql`
  ${DAY_SHIFT_FIELDS}
  query ScheduleV2($id: ID!, $shiftsFrom: Date!, $numberOfWeeks: Int!) {
    schedule(id: $id) {
      id
      name
      canManage
      displayMode
      defaultRole
      recentLocations
      shiftsFromRange(shiftsFrom: $shiftsFrom, numberOfWeeks: $numberOfWeeks) {
        ...DayShiftFields
      }
    }
  }
`

export const SCHEDULE_QUERY = gql`
  query Schedule($id: ID!) {
    schedule(id: $id) {
      id
      name
      displayMode
    }
  }
`

export const MY_OPEN_PLANNING_PERIODS_QUERY = gql`
  query MyOpenPlanningPeriods {
    myOpenPlanningPeriods {
      id
      dateFrom
      dateTo
      deadline
      status
      myDefaultAvailability
      schedule {
        id
        name
      }
      shifts {
        id
        name
        location
        datetimeStart
        datetimeEnd
        myInterest {
          interestType
          note
          source
        }
      }
    }
  }
`

export const MY_OPEN_PLANNING_PERIODS_SUMMARY_QUERY = gql`
  query MyOpenPlanningPeriodsSummary {
    myOpenPlanningPeriods {
      id
      dateFrom
      dateTo
      deadline
      status
      myDefaultAvailability
      schedule {
        id
        name
      }
      shifts {
        id
        myInterest {
          interestType
          source
        }
      }
    }
  }
`

export const ALL_SCHEDULE_TEMPLATES = gql`
  query AllScheduleTemplates {
    allScheduleTemplates {
      id
      name
      schedule {
        id
        name
      }
    }
  }
`

export const SCHEDULE_TEMPLATE_QUERY = gql`
  query ScheduleTemplate($id: ID!) {
    scheduleTemplate(id: $id) {
      id
      name
      schedule {
        id
        name
      }
      shiftTemplates {
        id
        location
        name
        timeStart
        timeEnd
        day
        duration
        shiftSlotTemplates {
          id
          count
          role
        }
      }
    }
  }
`

export const NORMALIZED_SHIFTS_FROM_RANGE_QUERY = gql`
  query NormalizedShiftsFromRange(
    $scheduleId: ID!
    $shiftsFrom: Date!
    $numberOfWeeks: Int!
  ) {
    normalizedShiftsFromRange(
      scheduleId: $scheduleId
      shiftsFrom: $shiftsFrom
      numberOfWeeks: $numberOfWeeks
    ) {
      ... on ShiftDayWeek {
        date
        shiftDays {
          date
          shifts {
            id
            name
            isFilled
            schedule {
              id
              name
            }
            slots {
              id
              role
              user {
                id
                initials
                getFullWithNickName
                profileImage
              }
            }
            location
            datetimeStart
            datetimeEnd
          }
        }
      }
      ... on ShiftLocationWeek {
        date
        shiftDays {
          date
          locations {
            location
            shifts {
              id
              name
              isFilled
              schedule {
                id
                name
              }
              slots {
                id
                role
                user {
                  id
                  initials
                  getFullWithNickName
                  profileImage
                }
              }
              location
              datetimeStart
              datetimeEnd
            }
          }
        }
      }
    }
  }
`

export const ALL_SHIFTS = gql`
  ${DAY_SHIFT_FIELDS}
  query AllShifts($date: Date!) {
    allShifts(date: $date) {
      ...DayShiftFields
    }
  }
`

export const TEMPLATE_GENERATION_PREVIEW_QUERY = gql`
  query TemplateGenerationPreview(
    $scheduleTemplateId: ID!
    $startDate: Date!
    $numberOfWeeks: Int!
  ) {
    templateGenerationPreview(
      scheduleTemplateId: $scheduleTemplateId
      startDate: $startDate
      numberOfWeeks: $numberOfWeeks
    ) {
      firstDay
      lastDay
      shiftsToCreate
      shiftsToDelete
      filledSlotsToDelete
      answersToDelete
      draftsToDelete
      needsConfirmation
    }
  }
`

// === PLANNING ===

export const SCHEDULE_PLANNING_QUERY = gql`
  query SchedulePlanning($id: ID!) {
    schedule(id: $id) {
      id
      name
      canManage
      planningPeriods {
        id
        dateFrom
        dateTo
        deadline
        status
        reminderSentAt
        responseStats {
          rosterCount
          optInCount
          usersWithAnswers
          optInWithInterest
          interested
          available
          unavailable
          unavailablePrefilled
          withNote
        }
        slotCoverage {
          shift {
            id
            name
            datetimeStart
          }
          role
          candidateBreakdown {
            membershipType
            candidateCount
            interestedCount
          }
          slotCount
          openSlotCount
          candidateCount
          interestedCount
          unavailableCount
          unavailableWithNoteCount
        }
      }
    }
  }
`

// === ROSTER ===

export const SCHEDULE_ROSTER_QUERY = gql`
  query ScheduleRoster($id: ID!) {
    schedule(id: $id) {
      id
      name
      canManage
      roster {
        id
        user {
          id
          fullName
          initials
          profileImage
        }
        autofillAs
        defaultAvailability
        shiftCap
        manuallyEdited
        addedManually
        countFrom
        membershipType
        shiftsDone
        shiftsPlanned
        lastShift
      }
    }
  }
`

export const SCHEDULE_ROSTER_RULES_QUERY = gql`
  query ScheduleRosterRules($id: ID!) {
    schedule(id: $id) {
      id
      name
      canManage
      internalGroup {
        id
        name
        positions {
          edges {
            node {
              id
              name
            }
          }
        }
      }
      rosterGroupings {
        id
        internalGroupPosition {
          id
          name
        }
        positionType
        role
        defaultAvailability
        shiftCap
      }
    }
  }
`

// Only for managers: the backend refuses rosterSyncPreview for other users
export const ROSTER_SYNC_PREVIEW_QUERY = gql`
  query RosterSyncPreview($id: ID!) {
    schedule(id: $id) {
      id
      rosterSyncPreview {
        kind
        user {
          id
          fullName
        }
        autofillAs
        defaultAvailability
        shiftCap
        message
      }
    }
  }
`
