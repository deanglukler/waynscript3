import { createTheme, ThemeOptions } from '@mui/material';

const backgroundDefault = '#171717';
const backgroundPaper = '#1c1c1c';

export const themeOptions: ThemeOptions = {
  palette: {
    mode: 'dark',
    primary: {
      main: '#dce775',
    },
    secondary: {
      main: '#e6ee9c',
    },
    background: {
      default: backgroundDefault,
      paper: backgroundPaper,
    },
    info: {
      main: '#64b5f6',
    },
    text: {
      primary: '#d5d5d5',
    },
    error: {
      main: '#d32f2f',
    },
    divider: 'rgba(256,256,256,0.3)',
  },
  typography: {
    fontFamily: 'Mukta',
    fontSize: 12,
    fontWeightLight: 300,
    h1: {
      fontSize: '2rem',
      fontWeight: 500,
    },
    h2: {
      fontSize: '1.4rem',
      fontWeight: 800,
    },
    h3: {
      fontSize: '1.2rem',
      fontWeight: 600,
    },
    h4: {
      fontSize: '1.5rem',
    },
    body1: {
      fontSize: '1rem',
    },
    body2: {
      fontSize: '1rem',
      lineHeight: 1.14,
    },
    button: {
      fontSize: '0.9rem',
      lineHeight: 1.3,
      fontWeight: 500,
    },
    caption: {
      fontSize: '0.7rem',
    },
    overline: {
      fontSize: '0.7rem',
      fontWeight: 300,
      lineHeight: 1.3,
    },
    subtitle2: {
      fontSize: '0.9rem',
    },
    subtitle1: {
      fontSize: '1.2rem',
      lineHeight: 1.02,
      fontWeight: 300,
    },
  },
  shape: {
    borderRadius: 4,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollbarColor: '#6b6b6b #2b2b2b',
          '&::-webkit-scrollbar, & *::-webkit-scrollbar': {
            backgroundColor: backgroundPaper,
          },
          '&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb': {
            borderRadius: 8,
            backgroundColor: '#6b6b6b',
            minHeight: 24,
            border: '3px solid #2b2b2b',
          },
          '&::-webkit-scrollbar-thumb:focus, & *::-webkit-scrollbar-thumb:focus':
            {
              backgroundColor: '#959595',
            },
          '&::-webkit-scrollbar-thumb:active, & *::-webkit-scrollbar-thumb:active':
            {
              backgroundColor: '#959595',
            },
          '&::-webkit-scrollbar-thumb:hover, & *::-webkit-scrollbar-thumb:hover':
            {
              backgroundColor: '#959595',
            },
          '&::-webkit-scrollbar-corner, & *::-webkit-scrollbar-corner': {
            backgroundColor: '#2b2b2b',
          },
        },
      },
    },
    MuiAppBar: {
      defaultProps: {
        color: 'default',
      },
    },
    MuiButtonBase: {
      defaultProps: {
        disableRipple: true,
      },
    },
    MuiList: {
      defaultProps: {
        dense: true,
      },
    },
    MuiMenuItem: {
      defaultProps: {
        dense: true,
      },
    },
    MuiTable: {
      defaultProps: {
        size: 'small',
      },
    },
    MuiButton: {
      defaultProps: {
        size: 'small',
      },
    },
    MuiButtonGroup: {
      defaultProps: {
        size: 'small',
      },
    },
    MuiCheckbox: {
      defaultProps: {
        size: 'small',
      },
    },
    MuiFab: {
      defaultProps: {
        size: 'small',
      },
    },
    MuiFormControl: {
      defaultProps: {
        margin: 'dense',
        size: 'small',
      },
    },
    MuiFormHelperText: {
      defaultProps: {
        margin: 'dense',
      },
    },
    MuiIconButton: {
      defaultProps: {
        size: 'small',
      },
    },
    MuiInputBase: {
      defaultProps: {
        margin: 'dense',
      },
    },
    MuiInputLabel: {
      defaultProps: {
        margin: 'dense',
      },
    },
    MuiRadio: {
      defaultProps: {
        size: 'small',
      },
    },
    MuiSwitch: {
      defaultProps: {
        size: 'small',
      },
    },
    MuiTextField: {
      defaultProps: {
        margin: 'dense',
        size: 'small',
      },
    },
  },
};

export const theme = createTheme(themeOptions);
