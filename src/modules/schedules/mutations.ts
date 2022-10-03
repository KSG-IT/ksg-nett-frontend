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
        name
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