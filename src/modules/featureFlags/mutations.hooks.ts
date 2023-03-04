import { useMutation } from '@apollo/client'
import { TOGGLE_FEATURE_FLAG } from './mutations'
import {
  ToggleFeatureFlagReturns,
  ToggleFeatureFlagVariables,
} from './types.graphql'

export function useFeatureFlagMutations() {
  const [toggleFeatureFlag, { loading: toggleFeatureFlagLoading }] =
    useMutation<ToggleFeatureFlagReturns, ToggleFeatureFlagVariables>(
      TOGGLE_FEATURE_FLAG
    )

  return {
    toggleFeatureFlag,
    toggleFeatureFlagLoading,
  }
}
