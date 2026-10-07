export const LOGIN_TOKEN_KEY = 'login-token'

export function setLoginToken(token: string) {
  localStorage.setItem(LOGIN_TOKEN_KEY, token)
}

export function hasSavedLoginToken() {
  return !!localStorage.getItem(LOGIN_TOKEN_KEY)
}

export function getLoginToken() {
  return localStorage.getItem(LOGIN_TOKEN_KEY)
}

export function removeLoginToken() {
  localStorage.removeItem(LOGIN_TOKEN_KEY)
}

// The default message of gql_login_required in ksg-nett-backend
// (common/decorators.py). The backend sends it when the token is missing,
// expired or invalid.
const NOT_LOGGED_IN_MESSAGE = 'You are not permitted to view this'

export function isNotLoggedInError(
  errors: readonly { message: string }[] | undefined
) {
  return !!errors?.some(error => error.message === NOT_LOGGED_IN_MESSAGE)
}
