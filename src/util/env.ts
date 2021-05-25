export const BASE_URL =
  process.env.NODE_ENV === 'production' ? '' : 'http://localhost:8008'

export const STAGE = isLocal() ? 'local' : process.env.REACT_APP_STAGE

export const API_URLS = {
  local: 'http://localhost:8008',
  development: 'https://api-dev.ksg-nett.no',
  production: 'https://api.ksg-nett.no',
}

export const API_URL = API_URLS[STAGE]

export function isLocal() {
  return process.env.NODE_ENV !== 'production'
}

export function isStage(stage: string) {
  return process.env.REACT_APP_STAGE === stage
}

export function isDev() {
  return isStage('dev')
}

export function isProd() {
  return isStage('prod')
}