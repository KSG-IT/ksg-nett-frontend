import { gql } from 'graphql-tag'

// ==== SCHEDULE TEMPLATE====

export const CREATE_SCHEDULE_TEMPLATE_MUTATION = gql`
  mutation CreateScheduleTemplate($input: CreateScheduleTemplateInput!) {
    createScheduleTemplate(input: $input) {
      scheduleTemplate {
        id
      }
    }
  }
`

export const PATCH_SCHEDULE_TEMPLATE_MUTATION = gql`
  mutation PatchScheduleTemplate(
    $id: ID!
    $input: PatchScheduleTemplateInput!
  ) {
    patchScheduleTemplate(id: $id, input: $input) {
      scheduleTemplate {
        id
      }
    }
  }
`

export const DELETE_SCHEDULE_TEMPLATE_MUTATION = gql`
  mutation DeleteScheduleTemplate($id: ID!) {
    deleteScheduleTemplate(id: $id) {
      found
    }
  }
`

// ==== SCHEDULE ====

export const PATCH_SCHEDULE_MUTATION = gql`
  mutation PatchSchedule($id: ID!, $input: PatchScheduleInput!) {
    patchSchedule(id: $id, input: $input) {
      schedule {
        id
      }
    }
  }
`

// ==== SHIFT TEMPLATE ====

export const CREATE_SHIFT_TEMPLATE_MUTATION = gql`
  mutation CreateShiftTemplate($input: CreateShiftTemplateInput!) {
    createShiftTemplate(input: $input) {
      shiftTemplate {
        id
      }
    }
  }
`

export const DELETE_SHIFT_TEMPLATE_MUTATION = gql`
  mutation DeleteShiftTemplate($id: ID!) {
    deleteShiftTemplate(id: $id) {
      found
    }
  }
`

// ==== SHIFT SLOT TEMPLATE ====
export const CREATE_SHIFT_SLOT_TEMPLATE_MUTATION = gql`
  mutation CreateShiftSlotTemplate($input: CreateShiftSlotTemplateInput!) {
    createShiftSlotTemplate(input: $input) {
      shiftSlotTemplate {
        id
      }
    }
  }
`

export const PATCH_SHIFT_SLOT_TEMPLATE_MUTATION = gql`
  mutation PatchShiftSlotTemplate(
    $id: ID!
    $input: PatchShiftSlotTemplateInput!
  ) {
    patchShiftSlotTemplate(id: $id, input: $input) {
      shiftSlotTemplate {
        id
      }
    }
  }
`

export const DELETE_SHIFT_SLOT_TEMPLATE_MUTATION = gql`
  mutation DeleteShiftSlotTemplate($id: ID!) {
    deleteShiftSlotTemplate(id: $id) {
      found
    }
  }
`

export const REMOVE_USER_FROM_SHIFT_SLOT_MUTATION = gql`
  mutation RemoveUserFromShiftSlot($shiftSlotId: ID!) {
    removeUserFromShiftSlot(shiftSlotId: $shiftSlotId) {
      shiftSlot {
        id
      }
    }
  }
`

export const ADD_USER_TO_SHIFT_SLOT_MUTATION = gql`
  mutation AddUserToShiftSlot($shiftSlotId: ID!, $userId: ID!) {
    addUserToShiftSlot(shiftSlotId: $shiftSlotId, userId: $userId) {
      shiftSlot {
        id
      }
    }
  }
`

export const GENERATE_SHIFTS_FROM_TEMPLATE_MUTATION = gql`
  mutation GenerateShiftsFromTemplate(
    $scheduleTemplateId: ID!
    $startDate: Date!
    $numberOfWeeks: Int!
  ) {
    generateShiftsFromTemplate(
      scheduleTemplateId: $scheduleTemplateId
      startDate: $startDate
      numberOfWeeks: $numberOfWeeks
    ) {
      shiftsCreated
    }
  }
`

export const DELETE_SHIFT_MUTATION = gql`
  mutation DeleteShift($id: ID!) {
    deleteShift(id: $id) {
      found
    }
  }
`

export const CREATE_SHIFT_MUTATION = gql`
  mutation CreateShift($input: CreateShiftInput!) {
    createShift(input: $input) {
      shift {
        id
      }
    }
  }
`

export const CREATE_SHIFT_SLOT_MUTATION = gql`
  mutation CreateShiftSlot($input: CreateShiftSlotInput!) {
    createShiftSlot(input: $input) {
      shiftSlot {
        id
      }
    }
  }
`

export const DELETE_SHIFT_SLOT_MUTATION = gql`
  mutation DeleteShiftSlot($id: ID!) {
    deleteShiftSlot(id: $id) {
      found
    }
  }
`
