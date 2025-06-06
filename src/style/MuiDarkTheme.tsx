// theme.ts
import { createTheme, ThemeOptions } from '@mui/material/styles';

const baseTheme: ThemeOptions = {
  typography: {
    fontFamily: 'Inter, sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
  },
};

export const lightTheme = createTheme({
  ...baseTheme,
  palette: {
    mode: 'light',
    background: {
      default: '#F9FAFB',
      paper: '#FFFFFF',
    },
    primary: {
      main: '#6366F1', // topbar
    },
    secondary: {
      main: '#D1FAE5', // chat bubble outgoing
    },
    error: {
      main: '#EF4444', // red button
    },
    text: {
      primary: '#111827',
      secondary: '#6B7280',
    },
    divider: '#D1D5DB', // border
    grey: {
      100: '#E5E7EB', // sidebar, inputBar, etc.
      200: '#EEF2FF', // chatHeader
      300: '#E0E7FF', // chatBubbleIncoming
    },
  },
});

export const darkTheme = createTheme({
  ...baseTheme,
  palette: {
    mode: 'dark',
    background: {
      default: '#111827',
      paper: '#0F172A',
    },
    primary: {
      main: '#1E3A8A', // topbar
    },
    secondary: {
      main: '#10B981', // chat bubble outgoing
    },
    error: {
      main: '#EF4444', // red button
    },
    text: {
      primary: '#F9FAFB',
      secondary: '#9CA3AF',
    },
    divider: '#334155', // border
    grey: {
      100: '#1E293B', // sidebar
      200: '#1F2937', // chatHeader
      300: '#1E40AF', // chatBubbleIncoming
    },
  },
});
