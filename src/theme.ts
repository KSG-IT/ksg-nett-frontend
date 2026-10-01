import {
  ActionIcon,
  Badge,
  createTheme,
  localStorageColorSchemeManager,
  rem,
  Text,
} from '@mantine/core'

export const theme = createTheme({
  // Mantine 9 changed the default from 'sm' to 'md'; keep the 8.x look
  defaultRadius: 'sm',
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
  // Mantine 7 changed xl from 24px to 32px; keep the Mantine 6 value
  spacing: { xl: rem(24) },
  // Mantine 7 changed these defaults to 'filled'; keep the Mantine 6 look
  components: {
    ActionIcon: ActionIcon.extend({ defaultProps: { variant: 'subtle' } }),
    Badge: Badge.extend({ defaultProps: { variant: 'light' } }),
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
