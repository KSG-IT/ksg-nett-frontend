import gql from 'graphql-tag'

export const ME_QUERY = gql`
  query Me {
    me {
      id
      username
      firstName
      lastName
      profileImage
      fullName
      initials
      email
      balance
      biography
      studyAddress
      homeAddress
      phone
      upvotedQuoteIds

      lastTransactions {
        # Is this an issue if we cache the activity?
        # This will become large at some point
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
      fullName
      firstName
      lastName
      biography
      studyAddress
      homeAddress
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
        verifiedBy {
          id
        }
        context
        tagged {
          id
          initials
          profileImage
          fullName
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
          profileImage
          initials
          phone
        }
      }
    }
  }
`
