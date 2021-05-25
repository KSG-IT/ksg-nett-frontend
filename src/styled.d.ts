import 'styled-components'
import theme from './theme'

export type CustomThemeType = typeof theme

declare module 'styled-components' {
  export interface DefaultTheme extends CustomThemeType {}
}