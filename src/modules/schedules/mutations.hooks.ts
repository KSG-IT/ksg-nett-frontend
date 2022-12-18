import { useMutation } from '@apollo/client'
import { DeleteMutationReturns, DeleteMutationVariables } from 'types/graphql'
import {
  ADD_SLOTS_TO_SHIFT_MUTATION,
  ADD_USER_TO_SHIFT_SLOT_MUTATION,
  CREATE_SCHEDULE_TEMPLATE_MUTATION,
  CREATE_SHIFT_MUTATION,
  CREATE_SHIFT_SLOT_MUTATION,
  CREATE_SHIFT_SLOT_TEMPLATE_MUTATION,
  CREATE_SHIFT_TEMPLATE_MUTATION,
  DELETE_SCHEDULE_TEMPLATE_MUTATION,
  DELETE_SHIFT_MUTATION,
  DELETE_SHIFT_SLOT_MUTATION,
  DELETE_SHIFT_SLOT_TEMPLATE_MUTATION,
  DELETE_SHIFT_TEMPLATE_MUTATION,
  GENERATE_SHIFTS_FROM_TEMPLATE_MUTATION,
  PATCH_SCHEDULE_MUTATION,
  PATCH_SCHEDULE_TEMPLATE_MUTATION,
  PATCH_SHIFT_MUTATION,
  PATCH_SHIFT_SLOT_TEMPLATE_MUTATION,
  REMOVE_USER_FROM_SHIFT_SLOT_MUTATION,
} from './mutations'
import {
  AddSlotsToShiftReturns,
  AddSlotsToShiftVariables,
  AddUserToShiftSlotReturns,
  AddUserToShiftSlotVariables,
  CreateScheduleTemplateReturns,
  CreateScheduleTemplateVariables,
  CreateShiftMutationReturns,
  CreateShiftMutationVariables,
  CreateShiftSlotReturns,
  CreateShiftSlotTemplateReturns,
  CreateShiftSlotTemplateVariables,
  CreateShiftSlotVariables,
  CreateShiftTemplateReturns,
  CreateShiftTemplateVariables,
  GenerateShiftsFromTemplateReturns,
  GenerateShiftsFromTemplateVariables,
  PatchScheduleReturns,
  PatchScheduleTemplateReturns,
  PatchScheduleTemplateVariables,
  PatchScheduleVariables,
  PatchShiftReturns,
  PatchShiftSlotTemplateReturns,
  PatchShiftSlotTemplateVariables,
  PatchShiftVariables,
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

export function useScheduleMutations() {
  const [patchSchedule, { loading: patchScheduleLoading }] = useMutation<
    PatchScheduleReturns,
    PatchScheduleVariables
  >(PATCH_SCHEDULE_MUTATION)

  return {
    patchSchedule,
    patchScheduleLoading,
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

  const [createShiftSlot, { loading: createShiftSlotLoading }] = useMutation<
    CreateShiftSlotReturns,
    CreateShiftSlotVariables
  >(CREATE_SHIFT_SLOT_MUTATION)

  const [deleteShiftSlot, { loading: deleteShiftSlotLoading }] = useMutation<
    DeleteMutationReturns,
    DeleteMutationVariables
  >(DELETE_SHIFT_SLOT_MUTATION)

  return {
    createShiftSlot,
    createShiftSlotLoading,
    deleteShiftSlot,
    deleteShiftSlotLoading,
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

  const [createShift, { loading: createShiftLoading }] = useMutation<
    CreateShiftMutationReturns,
    CreateShiftMutationVariables
  >(CREATE_SHIFT_MUTATION)

  const [addSlotsToShift, { loading: addSlotsToShiftLoading }] = useMutation<
    AddSlotsToShiftReturns,
    AddSlotsToShiftVariables
  >(ADD_SLOTS_TO_SHIFT_MUTATION)

  const [patchShift, { loading: patchShiftLoading }] = useMutation<
    PatchShiftReturns,
    PatchShiftVariables
  >(PATCH_SHIFT_MUTATION)

  return {
    createShift,
    createShiftLoading,
    deleteShift,
    deleteShiftLoading,
    patchShift,
    patchShiftLoading,
    generateShiftsFromTemplate,
    generateShiftsFromTemplateLoading,
    addSlotsToShift,
    addSlotsToShiftLoading,
  }
}
