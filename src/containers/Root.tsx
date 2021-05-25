import { ThemeProvider } from 'styled-components'
import {theme} from 'theme'
import MainLayout from './MainLayout'

function Root() {
  return (
    <ThemeProvider theme={theme}>
      <MainLayout />
    </ThemeProvider>
  )
}

export default Root;
