import React from 'react'
import { UserNode } from 'modules/users/types'

const USER_PLACEHOLDER = {
    id: "",
    firstName: "",
    lastName: "",
    username: "",
    fullName: "",
    phoneNumber: "",
    initials: "",
    email: "",
    isStaff: false,
    isSuperuser: false,
    isActive: false,
    needsPasswordChange: false,
    profilePicture: "",
    isAdministrator: false,
}

export const UserContext = React.createContext<UserNode>(USER_PLACEHOLDER)

export default UserContext