import { useState, useMemo, useEffect } from 'react';
import { ThemeProvider, createTheme, CssBaseline, IconButton, useMediaQuery } from '@mui/material';
import { Box, Typography, Container } from '@mui/material';
import { LockRounded, Brightness4, Brightness7 } from '@mui/icons-material';
import PasswordGenerator from './components/PasswordGenerator';
import './App.css';

function App() {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [mode, setMode] = useState<'light' | 'dark'>(() => {
    const savedMode = localStorage.getItem('themeMode');
    return (savedMode as 'light' | 'dark') || (prefersDarkMode ? 'dark' : 'light');
  });

  useEffect(() => {
    localStorage.setItem('themeMode', mode);
  }, [mode]);

  const theme = useMemo(() => createTheme({
    palette: {
      mode,
      primary: {
        main: '#667eea',
      },
      secondary: {
        main: '#764ba2',
      },
      background: {
        default: mode === 'dark' ? '#0f0c29' : '#f5f7fa',
        paper: mode === 'dark' ? 'rgba(26, 26, 46, 0.6)' : 'rgba(255, 255, 255, 0.7)',
      },
    },
    typography: {
      fontFamily: '"Outfit", "Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h4: {
        fontWeight: 700,
      },
    },
    shape: {
      borderRadius: 8,
    },
    components: {
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(255, 255, 255, 0.3)',
            boxShadow: mode === 'dark' ? '0 8px 32px 0 rgba(0, 0, 0, 0.37)' : '0 8px 32px 0 rgba(31, 38, 135, 0.1)',
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: 600,
          },
        },
      },
    },
  }), [mode]);

  const toggleColorMode = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          background: mode === 'dark'
            ? 'linear-gradient(-45deg, #0f0c29, #302b63, #24243e, #0f0c29)'
            : 'linear-gradient(-45deg, #f5f7fa, #c3cfe2, #e0eafc, #f5f7fa)',
          backgroundSize: '400% 400%',
          animation: 'gradientBG 15s ease infinite',
          backgroundAttachment: 'fixed',
          transition: 'background 0.3s ease',
        }}
      >
        {/* Header */}
        <Box
          className="fade-in-up delay-1"
          sx={{
            pt: 4,
            pb: 2,
            textAlign: 'center',
            position: 'relative',
          }}
        >
          <Box sx={{ position: 'absolute', right: 20, top: 20 }}>
            <IconButton onClick={toggleColorMode} color="inherit">
              {mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
            </IconButton>
          </Box>

          <Container maxWidth="md">
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 2,
                mb: 2,
              }}
            >
              <LockRounded sx={{ fontSize: 48, color: '#667eea' }} />
              <Typography
                variant="h3"
                component="h1"
                sx={{
                  fontWeight: 800,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                StrongPass Generator
              </Typography>
            </Box>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ maxWidth: 600, mx: 'auto' }}
            >
              Create ultra-secure, customizable passwords with advanced cryptographic algorithms.
              Your security is our priority.
            </Typography>
          </Container>
        </Box>

        {/* Main Content */}
        <Box className="fade-in-up delay-2">
          <PasswordGenerator />
        </Box>

        {/* Footer */}
        <Box
          className="fade-in-up delay-3"
          sx={{
            py: 4,
            textAlign: 'center',
          }}
        >
          <Typography variant="body2" color="text.secondary">
            Built with C# .NET 10 & React TypeScript | All passwords are generated locally
            <br />
            Created by <strong>Shlok Sharma</strong>
          </Typography>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
