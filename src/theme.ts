import {
  ActionIcon,
  createTheme,
  localStorageColorSchemeManager,
  NumberFormatter,
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
    'samfundet-red': [
      '#ffedee',
      '#f4dbdb',
      '#e5b3b5',
      '#d88a8c',
      '#cd6769',
      '#b74c4e',
      '#A03033',
      '#892429',
      '#711b20',
      '#5a1217',
    ],
  },
  primaryColor: 'samfundet-red',
  fontFamily: 'Inter, "Open Sans", Helvetica, Arial, sans-serif',
  // Mantine 7 changed the ActionIcon default to 'filled'. 'subtle' fits the
  // icon buttons on coloured backgrounds, for example the shift slots.
  components: {
    ActionIcon: ActionIcon.extend({ defaultProps: { variant: 'subtle' } }),
    NumberFormatter: NumberFormatter.extend({
      defaultProps: { thousandSeparator: ' ' },
    }),
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
