import { createMuiTheme } from '@material-ui/core/styles';

export const palette = {
  white: { main: '#fff' },
  black: { main: '#000' },
  primary: { main: '#2e3648', light: '#7ca3aa', middle: '#437f9c' },
  secondary: { main: '#439c6d', middle: '#41b3a6', light: '#8db183' },
  error: { main: '#ce3c3d' },
  danger: { main: '#a00103', middle: '#d9534f', light: '#f2dede' },
  lightGrey: { main: '#e5e5e5', light: '#f5f5f5' },
  sandy: { main: '#eee0cd' },
  grey: {
    main: '#C0C0C0',
    middle: '#6d737f',
    light: '#999999',
    lightBlue: '#cdd3df',
  },
  blue: {
    deep: '#161FBC',
    dark: '#1d5a6d',
    main: '#2b809f',
    middle: '#7DA5AC',
    light: '#91C0C8',
    graph: '#89CBE0',
  },
  green: {
    deep: '#105700',
    light: '#D0EED0',
  },
  links: { main: '#0078A8' },
  graph: { main: '#89CBE0' },
  lightGreen: { main: '#A9C68A' },
  statuses: {
    pending: '#d1863d',
    running: '#429fcc',
    finished: '#439c6d',
    cancelled: '#e6594a',
    failed: '#d84315',
  },
  deepBlueColorRange: [
    'rgb(230,0,0) 0%',
    'rgb(255,9,0) 10%',
    'rgb(248,247,0) 35%',
    'rgb(0,230,248) 65%',
    'rgb(0,0,128) 100%',
  ],
  linearColorRange: [
    'hsl(0, 80%, 50%) 0%',
    'hsl(60, 80%, 50%) 25%',
    'hsl(120, 80%, 50%) 50%',
    'hsl(180, 80%, 50%) 75%',
    'hsl(240, 80%, 50%) 100%',
  ],
  redToGreenRange: [
    'rgb(255, 0, 0) 0%',
    'rgb(255, 255, 0) 75%',
    'rgb(0, 255, 0) 90%',
    'rgb(0, 131, 9) 100%',
  ],
  graphLines: {
    green: '#439c6d',
    red: '#ce3c3d',
    blue: '#161fbc',
  },
};

const typography = {
  fontFamily: [
    'Montserrat',
    '"Helvetica Neue"',
    'Helvetica',
    'Arial',
    'sans-serif',
    'Tahoma',
    'Verdana',
    'sans-serif',
    '"Glyphicons Halflings"',
  ].join(','),
};

export const theme = createMuiTheme({
  defaultTransition: '.16s',
  navbarHeight: 105,
  baseSideBarWidth: 310,
  projectMenuHeight: 37,
  dashboardToolbarHeight: 80,
  zIndexMap: 400,
  zIndexNavBar: 1100,
  zIndexMax: 1200,
  palette,
  typography,
});
