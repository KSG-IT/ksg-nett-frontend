import { gql } from '@apollo/client'

export const MY_SHIFTS_QUERY = gql`
  query MyShiftQuery($id: ID) {
    user(id: $id) {
      shiftSet {
        edges {
          node {
            slot {
              group {
                name
                meetTime
                shiftSlots {
                  edges {
                    node {
                      filledShift {
                        user {
                          firstName
                          lastName
                        }
                        slot {
                          type {
                            name
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`
