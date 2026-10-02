import {
  ActionIcon,
  createTheme,
  localStorageColorSchemeManager,
  Text,
} from '@mantine/core'

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
  fontFamily: 'Inter, "Open Sans", Helvetica, Arial, sans-serif',
  // Mantine 7 changed the ActionIcon default to 'filled'. 'subtle' fits the
  // icon buttons on coloured backgrounds, for example the shift slots.
  components: {
    ActionIcon: ActionIcon.extend({ defaultProps: { variant: 'subtle' } }),
    // In Mantine 6 Text without size inherited the font size of its parent.
    // Since Mantine 7 it is always md.
    Text: Text.extend({
      vars: (_theme, props) => ({
        root: props.size === undefined ? { '--text-fz': 'inherit' } : {},
      }),
    }),
  },
})

// https://www.petarstefanov.com/blog/2020-03-10-react-styled-components-mobile-first-aproach/
