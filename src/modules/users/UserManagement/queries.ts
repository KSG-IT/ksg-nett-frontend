import { gql } from 'graphql-tag'

export const MANAGE_USERS_DATA_QUERY = gql`
  query ManageUsersDataQuery($activeOnly: Boolean!, $internalGroupId: ID!) {
    manageUsersData(
      activeOnly: $activeOnly
      internalGroupId: $internalGroupId
    ) {
      userId
      fullName
      dateJoinedSemesterShorthand
      internalGroupPositionType
      positionName
    }
  }
`
