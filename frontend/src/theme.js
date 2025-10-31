import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2E7D32', // Deep green representing fertile soil
      light: '#4CAF50', // Fresh green for growth
      dark: '#1B5E20', // Dark green for mature plants
    },
    secondary: {
      main: '#FFA000', // Amber for harvest/sun
      light: '#FFB74D', // Light amber for sunlight
      dark: '#F57C00', // Dark amber for sunset
    },
    background: {
      default: '#F1F8E9', // Light green tint for background
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1B5E20', // Dark green for main text
      secondary: '#558B2F', // Medium green for secondary text
    },
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
    },
    h2: {
      fontWeight: 600,
      fontSize: '2rem',
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.75rem',
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '8px 24px',
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0px 2px 4px rgba(0,0,0,0.1)',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0px 2px 4px rgba(0,0,0,0.1)',
        },
      },
    },
  },
});

export default theme; 