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
