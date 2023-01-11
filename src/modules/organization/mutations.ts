import { gql } from 'graphql-tag'

export const PATCH_INTERNAL_GROUP = gql`
  mutation PatchInternalGroup($id: ID!, $input: PatchInternalGroupInput!) {
    patchInternalGroup(id: $id, input: $input) {
      internalGroup {
        id
      }
    }
  }
`

export const PATCH_INTERNAL_GROUP_POSITION_MEMBERSHIP_MUTATION = gql`
  mutation PatchInternalGroupPositionMembership(
    $id: ID!
    $input: PatchInternalGroupPositionMembershipInput!
  ) {
    patchInternalGroupPositionMembership(id: $id, input: $input) {
      internalGroupPositionMembership {
        id
      }
    }
  }
`

export const PATCH_INTERNAL_GROUP_USER_HIGHLIGHT_MUTATION = gql`
  mutation PatchInternalGroupUserHighlight(
    $id: ID!
    $input: PatchInternalGroupUserHighlightInput!
  ) {
    patchInternalGroupUserHighlight(id: $id, input: $input) {
      internalGroupUserHighlight {
        id
      }
    }
  }
`

export const BATCH_PATCH_INTERNAL_GROUP_USER_HIGHLIGHT_MUTATION = gql`
  mutation BatchPatchInternalGroupUserHighlight(
    $input: [BatchPatchInternalGroupUserHighlightInput]!
  ) {
    batchPatchInternalGroupUserHighlight(input: $input) {
      internalGroupUserHighlights {
        id
      }
    }
  }
`

export const QUIT_KSG_MUTATION = gql`
  mutation QuitKSG($membershipId: ID!) {
    quitKsg(membershipId: $membershipId) {
      internalGroupPositionMembership {
        id
      }
    }
  }
`

export const ASSIGN_NEW_INTERNAL_GROUP_POSITION_MEMBERSHIP = gql`
  mutation AssignNewInternalGroupPositionMembership(
    $userId: ID!
    $internalGroupPositionId: ID!
    $internalGroupPositionType: InternalGroupPositionTypeEnum
  ) {
    assignNewInternalGroupPositionMembership(
      userId: $userId
      internalGroupPositionId: $internalGroupPositionId
      internalGroupPositionType: $internalGroupPositionType
    ) {
      internalGroupPositionMembership {
        id
      }
    }
  }
`

export const PATCH_INTERNAL_GROUP_MUTATION = gql`
  mutation PatchInternalGroup($id: ID!, $input: PatchInternalGroupInput!) {
    patchInternalGroup(id: $id, input: $input) {
      internalGroup {
        id
      }
    }
  }
`
