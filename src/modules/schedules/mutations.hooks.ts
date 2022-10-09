import { useMutation } from '@apollo/client'
import { DeleteMutationReturns, DeleteMutationVariables } from 'types/graphql'
import {
  ADD_USER_TO_SHIFT_SLOT_MUTATION,
  CREATE_SCHEDULE_TEMPLATE_MUTATION,
  CREATE_SHIFT_SLOT_TEMPLATE_MUTATION,
  CREATE_SHIFT_TEMPLATE_MUTATION,
  DELETE_SCHEDULE_TEMPLATE_MUTATION,
  DELETE_SHIFT_MUTATION,
  DELETE_SHIFT_SLOT_TEMPLATE_MUTATION,
  DELETE_SHIFT_TEMPLATE_MUTATION,
  GENERATE_SHIFTS_FROM_TEMPLATE_MUTATION,
  PATCH_SCHEDULE_TEMPLATE_MUTATION,
  PATCH_SHIFT_SLOT_TEMPLATE_MUTATION,
  REMOVE_USER_FROM_SHIFT_SLOT_MUTATION,
} from './mutations'
import {
  AddUserToShiftSlotReturns,
  AddUserToShiftSlotVariables,
  CreateScheduleTemplateReturns,
  CreateScheduleTemplateVariables,
  CreateShiftSlotTemplateReturns,
  CreateShiftSlotTemplateVariables,
  CreateShiftTemplateReturns,
  CreateShiftTemplateVariables,
  GenerateShiftsFromTemplateReturns,
  GenerateShiftsFromTemplateVariables,
  PatchScheduleTemplateReturns,
  PatchScheduleTemplateVariables,
  PatchShiftSlotTemplateReturns,
  PatchShiftSlotTemplateVariables,
  RemoveUserFromShiftSlotReturns,
  RemoveUserFromShiftSlotVariables,
} from './types.graphql'

export function useScheduleTemplateMutations() {
  const [createScheduleTemplate, { loading: createScheduleTemplateLoading }] =
    useMutation<CreateScheduleTemplateReturns, CreateScheduleTemplateVariables>(
      CREATE_SCHEDULE_TEMPLATE_MUTATION
    )

  const [patchScheduleTemplate, { loading: patchScheduleTemplateLoading }] =
    useMutation<PatchScheduleTemplateReturns, PatchScheduleTemplateVariables>(
      PATCH_SCHEDULE_TEMPLATE_MUTATION
    )

  const [deleteScheduleTemplate, { loading: deleteScheduleTemplateLoading }] =
    useMutation<DeleteMutationReturns, DeleteMutationVariables>(
      DELETE_SCHEDULE_TEMPLATE_MUTATION
    )

  return {
    createScheduleTemplate,
    createScheduleTemplateLoading,
    patchScheduleTemplate,
    patchScheduleTemplateLoading,
    deleteScheduleTemplate,
    deleteScheduleTemplateLoading,
  }
}

export function useShiftTemplateMutations() {
  const [createShiftTemplate, { loading: createShiftTemplateLoading }] =
    useMutation<CreateShiftTemplateReturns, CreateShiftTemplateVariables>(
      CREATE_SHIFT_TEMPLATE_MUTATION
    )

  const [deleteShiftTemplate, { loading: deleteShiftTemplateLoading }] =
    useMutation<DeleteMutationReturns, DeleteMutationVariables>(
      DELETE_SHIFT_TEMPLATE_MUTATION
    )

  return {
    createShiftTemplate,
    createShiftTemplateLoading,
    deleteShiftTemplate,
    deleteShiftTemplateLoading,
  }
}

export function useShiftSlotTemplateMutations() {
  const [createShiftSlotTemplate, { loading: createShiftSlotTemplateLoading }] =
    useMutation<
      CreateShiftSlotTemplateReturns,
      CreateShiftSlotTemplateVariables
    >(CREATE_SHIFT_SLOT_TEMPLATE_MUTATION)

  const [patchShiftSlotTemplate, { loading: patchShiftSlotTemplateLoading }] =
    useMutation<PatchShiftSlotTemplateReturns, PatchShiftSlotTemplateVariables>(
      PATCH_SHIFT_SLOT_TEMPLATE_MUTATION
    )

  const [deleteShiftSlotTemplate, { loading: deleteShiftSlotTemplateLoading }] =
    useMutation<DeleteMutationReturns, DeleteMutationVariables>(
      DELETE_SHIFT_SLOT_TEMPLATE_MUTATION
    )

  return {
    createShiftSlotTemplate,
    createShiftSlotTemplateLoading,
    patchShiftSlotTemplate,
    patchShiftSlotTemplateLoading,
    deleteShiftSlotTemplate,
    deleteShiftSlotTemplateLoading,
  }
}

export function useShiftSlotMutations() {
  const [addUserToShiftSlot, { loading: addUserToShiftSlotLoading }] =
    useMutation<AddUserToShiftSlotReturns, AddUserToShiftSlotVariables>(
      ADD_USER_TO_SHIFT_SLOT_MUTATION
    )

  const [removeUserFromShiftSlot, { loading: removeUserFromShiftSlotLoading }] =
    useMutation<
      RemoveUserFromShiftSlotReturns,
      RemoveUserFromShiftSlotVariables
    >(REMOVE_USER_FROM_SHIFT_SLOT_MUTATION)

  return {
    addUserToShiftSlot,
    addUserToShiftSlotLoading,
    removeUserFromShiftSlot,
    removeUserFromShiftSlotLoading,
  }
}

export function useShiftMutations() {
  const [
    generateShiftsFromTemplate,
    { loading: generateShiftsFromTemplateLoading },
  ] = useMutation<
    GenerateShiftsFromTemplateReturns,
    GenerateShiftsFromTemplateVariables
  >(GENERATE_SHIFTS_FROM_TEMPLATE_MUTATION)

  const [deleteShift, { loading: deleteShiftLoading }] = useMutation<
    DeleteMutationReturns,
    DeleteMutationVariables
  >(DELETE_SHIFT_MUTATION)

  return {
    deleteShift,
    deleteShiftLoading,
    generateShiftsFromTemplate,
    generateShiftsFromTemplateLoading,
  }
}
