import { ApolloCache, useMutation } from '@apollo/client'
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
  ADD_SCHEDULE_ROSTER_ENTRY_MUTATION,
  CREATE_SCHEDULE_ROSTER_GROUPING_MUTATION,
  DELETE_SCHEDULE_ROSTER_GROUPING_MUTATION,
  PATCH_SCHEDULE_ROSTER_GROUPING_MUTATION,
  REMOVE_SCHEDULE_ROSTER_ENTRY_MUTATION,
  SYNC_SCHEDULE_ROSTER_MUTATION,
  UPDATE_SCHEDULE_ROSTER_ENTRY_MUTATION,
  PUBLISH_PLANNING_PERIOD_MUTATION,
  REVERT_AUTOFILL_RUN_MUTATION,
  RUN_AUTOFILL_MUTATION,
} from './mutations'
import {
  SCHEDULE_PLANNING_QUERY,
  ROSTER_SYNC_PREVIEW_QUERY,
  SCHEDULE_ROSTER_QUERY,
  SCHEDULE_ROSTER_RULES_QUERY,
} from './queries'
import {
  PublishPlanningPeriodReturns,
  RevertAutofillRunReturns,
  RunAutofillReturns,
  RunAutofillVariables,
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
  AddScheduleRosterEntryReturns,
  AddScheduleRosterEntryVariables,
  CreateScheduleRosterGroupingReturns,
  CreateScheduleRosterGroupingVariables,
  DeleteScheduleRosterGroupingReturns,
  PatchScheduleRosterGroupingReturns,
  PatchScheduleRosterGroupingVariables,
  RemoveScheduleRosterEntryReturns,
  SyncScheduleRosterReturns,
  SyncScheduleRosterVariables,
  UpdateScheduleRosterEntryReturns,
  UpdateScheduleRosterEntryVariables,
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

// A change to a rule or a row changes the sync preview. Apollo refetches only
// the queries on screen; the roster pages load with cache-and-network.
const ROSTER_RULE_REFETCH = [
  SCHEDULE_ROSTER_RULES_QUERY,
  ROSTER_SYNC_PREVIEW_QUERY,
]
const ROSTER_ROW_REFETCH = [SCHEDULE_ROSTER_QUERY, ROSTER_SYNC_PREVIEW_QUERY]

export function useScheduleRosterMutations() {
  const [createGrouping, { loading: createGroupingLoading }] = useMutation<
    CreateScheduleRosterGroupingReturns,
    CreateScheduleRosterGroupingVariables
  >(CREATE_SCHEDULE_ROSTER_GROUPING_MUTATION, {
    refetchQueries: ROSTER_RULE_REFETCH,
  })

  const [patchGrouping, { loading: patchGroupingLoading }] = useMutation<
    PatchScheduleRosterGroupingReturns,
    PatchScheduleRosterGroupingVariables
  >(PATCH_SCHEDULE_ROSTER_GROUPING_MUTATION, {
    refetchQueries: [ROSTER_SYNC_PREVIEW_QUERY],
  })

  const [deleteGrouping, { loading: deleteGroupingLoading }] = useMutation<
    DeleteScheduleRosterGroupingReturns,
    DeleteMutationVariables
  >(DELETE_SCHEDULE_ROSTER_GROUPING_MUTATION, {
    refetchQueries: ROSTER_RULE_REFETCH,
  })

  const [syncRoster, { loading: syncRosterLoading }] = useMutation<
    SyncScheduleRosterReturns,
    SyncScheduleRosterVariables
  >(SYNC_SCHEDULE_ROSTER_MUTATION, { refetchQueries: ROSTER_ROW_REFETCH })

  const [addEntry, { loading: addEntryLoading }] = useMutation<
    AddScheduleRosterEntryReturns,
    AddScheduleRosterEntryVariables
  >(ADD_SCHEDULE_ROSTER_ENTRY_MUTATION, { refetchQueries: ROSTER_ROW_REFETCH })

  const [updateEntry, { loading: updateEntryLoading }] = useMutation<
    UpdateScheduleRosterEntryReturns,
    UpdateScheduleRosterEntryVariables
  >(UPDATE_SCHEDULE_ROSTER_ENTRY_MUTATION, {
    refetchQueries: [ROSTER_SYNC_PREVIEW_QUERY],
  })

  const [removeEntry, { loading: removeEntryLoading }] = useMutation<
    RemoveScheduleRosterEntryReturns,
    DeleteMutationVariables
  >(REMOVE_SCHEDULE_ROSTER_ENTRY_MUTATION, {
    refetchQueries: ROSTER_ROW_REFETCH,
  })

  return {
    createGrouping,
    createGroupingLoading,
    patchGrouping,
    patchGroupingLoading,
    deleteGrouping,
    deleteGroupingLoading,
    syncRoster,
    syncRosterLoading,
    addEntry,
    addEntryLoading,
    updateEntry,
    updateEntryLoading,
    removeEntry,
    removeEntryLoading,
  }
}

// The v2 grid keeps the slots and drafts of a schedule in the cache. Autofill,
// revert and publish change them on the server, so the grid loads them again.
function evictSchedulePlan(cache: ApolloCache<unknown>, scheduleId: string) {
  const id = cache.identify({ __typename: 'ScheduleNode', id: scheduleId })
  cache.evict({ id, fieldName: 'shiftsFromRange' })
  cache.evict({ id, fieldName: 'draftCount' })
  cache.gc()
}

export function usePlanningPeriodPlanMutations(scheduleId: string) {
  const options = {
    refetchQueries: [SCHEDULE_PLANNING_QUERY],
    update: (cache: ApolloCache<unknown>) =>
      evictSchedulePlan(cache, scheduleId),
  }

  const [runAutofill, { loading: runAutofillLoading }] = useMutation<
    RunAutofillReturns,
    RunAutofillVariables
  >(RUN_AUTOFILL_MUTATION, options)

  const [revertAutofillRun, { loading: revertAutofillRunLoading }] =
    useMutation<RevertAutofillRunReturns, { id: string }>(
      REVERT_AUTOFILL_RUN_MUTATION,
      options
    )

  const [publishPeriod, { loading: publishPeriodLoading }] = useMutation<
    PublishPlanningPeriodReturns,
    { id: string }
  >(PUBLISH_PLANNING_PERIOD_MUTATION, options)

  return {
    runAutofill,
    runAutofillLoading,
    revertAutofillRun,
    revertAutofillRunLoading,
    publishPeriod,
    publishPeriodLoading,
  }
}
