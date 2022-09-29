import { gql } from 'graphql-tag'

export const PATCH_SCHEDULE_TEMPLATE_MUTATION = gql`
  mutation PatchScheduleTemplate($id: ID!, $input: PatchScheduleTemplateInput!) {
    patchScheduleTemplate(id: $id, input: $input) {
      id
      name
      }
    }
  }
`
