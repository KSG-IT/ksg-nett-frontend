export const theme = {
  colors: {
    primary: '#E87644', // primary color has not been determined yet?
    secondary: 'secondary',

    gray1: '#333333',
    gray2: '#BBBBBB',
    gray3: 'CCCCCC',
    gray4: 'DDDDDD',

    // from https://anice.red/#1D1D39
    lightGray: '#F2F2F3',
    midGray: '#C8CDD0',
    darkGray: '#415058',
    black: '#1F292E',

    background: '#EEEEEE',

    white: '#FFFFFF',
    // shortcut color scheme copy
    purple: '#1D1D39', // potential primary color
    purpleHover: '#121022',
    purpleAction: '#701fea',
    blue: '#2A4CBA',
    blueHover: '#2C50C3',
    cancelGray: '#E9E9E9',
    cancelGrayHover: '#D6D6D6',
    warningRed: '#B84546',
    warningRedHover: '#750600',
    successGreen: '#149136',
    successGreenLight: '#CDE5D5',

    success: '#5EB234',
    error: '#C91D2B',
    warning: '#E8B130',
  },
  media: {
    mobile: '@media screen and (max-width: 768px)',
    smallScreen: '@media screen and (max-width: 400px)',
    largeScreen: '@media screen and (max-width: 1600px)',
  },
  shadow: {
    default: '0 2px 6px 0 rgba(0, 0, 0, 0.2);',
  },

  layout: {
    default: `
    width: 100%;
    padding: 32px 52px 52px;
    box-sizing: border-box;
    @media screen and (max-width: 768px){
      padding: 1rem;
    }
  `,
  },

  resetButton: `
  appearance: none;
  background: none;
  border: none;
  outline: none;
`,
}
// https://www.petarstefanov.com/blog/2020-03-10-react-styled-components-mobile-first-aproach/
