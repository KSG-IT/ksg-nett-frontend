import gql from 'graphql-tag'

export const ME_QUERY = gql`
  query Me {
    me {
      id
      profileImage
      firstName
      getFullWithNickName
      getCleanFullName
      initials
      email
      balance
      icalToken
      owesMoney
      upvotedQuoteIds
      requiresMigrationWizard
      firstTimeLogin
      lastTransactions {
        name
        amount
        quantity
        timestamp
      }
      isSuperuser
      allPermissions
    }
  }
`

export const USER_QUERY = gql`
  query User($id: ID!) {
    user(id: $id) {
      id
      getFullWithNickName
      getCleanFullName
      firstName
      lastName
      nickname
      aboutMe
      homeTown
      dateOfBirth
      ksgStatus
      study
      studyAddress
      email
      phone
      initials
      profileImage
      internalGroupPositionMembershipHistory {
        id
        membershipStart
        membershipEnd
        position {
          name
          internalGroup {
            name
          }
        }
      }
      taggedAndVerifiedQuotes {
        id
        text
        sum
        context
        semester
        tagged {
          id
          initials
          profileImage
          getFullWithNickName
        }
      }
    }
  }
`

export const ALL_ACTIVE_USERS_SHALLOW_QUERY = gql`
  query AllActiveUsers($q: String) {
    allActiveUsers(q: $q) {
      edges {
        node {
          id
          fullName
          getCleanFullName
          profileImage
          initials
          phone
        }
      }
    }
  }
`

export const ALL_ACTIVE_USERS_LIST_QUERY = gql`
  query AllActiveUsersList($q: String) {
    allActiveUsersList(q: $q) {
      id
      getCleanFullName
      profileImage
      initials
      phone
    }
  }
`

export const MANAGE_USERS_DATA_QUERY = gql`
  query ManageUsersDataQuery($internalGroupId: ID!) {
    manageUsersData(internalGroupId: $internalGroupId) {
      activeMemberships {
        userId
        fullName
        dateJoinedSemesterShorthand
        dateEndedSemesterShorthand
        internalGroupPositionMembership {
          id
          getTypeDisplay
          position {
            id
          }
        }
        internalGroupPositionType
        positionName
      }
      allMemberships {
        userId
        fullName
        dateJoinedSemesterShorthand
        dateEndedSemesterShorthand
        internalGroupPositionMembership {
          id
          getTypeDisplay
          position {
            id
          }
        }
        internalGroupPositionType
        positionName
      }
    }
  }
`

export const ALL_USER_TYPES_QUERY = gql`
  query AllUserTypes {
    allUserTypes {
      id
      name
    }
  }
`

export const USER_TYPE_DETAIL_QUERY = gql`
  query UserTypeDetail($id: ID!) {
    userType(id: $id) {
      id
      name
      description
      users {
        id
        getCleanFullName
      }
      changelog {
        id
        timestamp
        action
        doneBy {
          id
          getCleanFullName
        }
        user {
          id
          getCleanFullName
        }
      }
    }
  }
`
