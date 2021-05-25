declare namespace NodeJS {
  export interface ProcessEnv {
    NODE_ENV: 'production' | 'development'
    REACT_APP_STAGE: 'development' | 'production'
  }
}
