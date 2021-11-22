export const theme = {
  colors: {
    primary: '#E87644',  // primary color has not been determined yet?
    secondary: 'secondary',

    gray1: '#333333',
    gray2: '#BBBBBB',
    gray3: 'CCCCCC',
    gray4: 'DDDDDD',

    background: '#EEEEEE',

    white: '#FFFFFF',
    purple: '#1D1D39',  // potential primary color
    purpleHover: '#121022',


    success: 'success',
    error: 'error',
    warning: 'warning',
  },
  media: {
    mobile: '@media screen and (max-width: 768px)',
    smallScreen: '@media screen and (max-width: 400px)',
    largeScreen: '@media screen and (max-width: 1600px)',
  },
  shadow: {
    default: '0 2px 6px 0 rgba(0, 0, 0, 0.2);',
  },

  resetButton: `
  appearance: none;
  background: none;
  border: none;
  outline: none;
`,
}
// https://www.petarstefanov.com/blog/2020-03-10-react-styled-components-mobile-first-aproach/
