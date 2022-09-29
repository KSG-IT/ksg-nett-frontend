import { useMutation } from '@apollo/client'
import { PATCH_SCHEDULE_TEMPLATE_MUTATION } from './mutations'
import {
  PatchScheduleTemplateReturns,
  PatchScheduleTemplateVariables,
} from './types.graphql'

export function useScheduleTemplateMutations() {
  const [patchScheduleTemplate, { loading: patchScheduleTemplateLoading }] =
    useMutation<PatchScheduleTemplateReturns, PatchScheduleTemplateVariables>(
      PATCH_SCHEDULE_TEMPLATE_MUTATION
    )

  return { patchScheduleTemplate, patchScheduleTemplateLoading }
}
