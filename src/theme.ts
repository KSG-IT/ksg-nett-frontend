import { createTheme, localStorageColorSchemeManager } from '@mantine/core'

export const theme = createTheme({
  colors: {
    white: [
      '#fff',
      '#fff',
      '#fff',
      '#fff',
      '#fff',
      '#fff',
      '#fff',
      '#fff',
      '#fff',
      '#fff',
    ],
    brand: [
      '#f5e6e6',
      '#e8bebe',
      '#da9595',
      '#cc6d6d',
      '#be4445',
      '#A03033',
      '#8a282b',
      '#721f22',
      '#5a1518',
      '#430c0e',
    ],
    'samfundet-red': [
      '#ffe7ea',
      '#f2c2c3',
      '#e49c9e',
      '#d77578',
      '#ca4e52',
      '#b13538',
      '#A03033',
      '#641b1e',
      '#3e0f11',
      '#1d0202',
    ],
  },
  primaryColor: 'samfundet-red',
  fontFamily: '"Inter"',
})

// https://www.petarstefanov.com/blog/2020-03-10-react-styled-components-mobile-first-aproach/
