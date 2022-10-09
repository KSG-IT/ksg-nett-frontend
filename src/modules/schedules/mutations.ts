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
