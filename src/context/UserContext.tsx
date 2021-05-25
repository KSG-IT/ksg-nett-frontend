import React from 'react'


interface UserNode {
    id: string
    firstName: string
    lastName: string
    username: string
}

const USER_PLACEHOLDER = {
    id: "",
    firstName: "",
    lastName: "",
    username: "",
}

export const UserContext = React.createContext<UserNode>(USER_PLACEHOLDER)

export default UserContext