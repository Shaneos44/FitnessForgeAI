import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  fonts: {
    heading: `'Inter', 'SF Pro Display', 'Poppins', sans-serif`,
    body: `'Inter', 'SF Pro Text', 'Poppins', sans-serif`,
  },
  colors: {
    brand: {
      50: '#f5f8ff',
      100: '#e3eafe',
      200: '#b6c7f7',
      300: '#7a8fe7',
      400: '#4c5fc4',
      500: '#2e3a8c',
      600: '#232a5e',
      700: '#181d3a',
      800: '#101227',
      900: '#080a13',
    },
    accent: {
      100: '#fff7ed',
      200: '#ffe3c7',
      300: '#ffc38b',
      400: '#ff9b4b',
      500: '#ff6a1c',
      600: '#d94e0b',
      700: '#a83809',
      800: '#752604',
      900: '#3d1300',
    },
    glass: {
      100: 'rgba(255,255,255,0.7)',
      200: 'rgba(255,255,255,0.3)',
      dark: 'rgba(24,29,58,0.7)',
    },
    success: {
      500: '#22c55e',
    },
    error: {
      500: '#ef4444',
    },
    warning: {
      500: '#f59e42',
    },
  },
  shadows: {
    glassy: '0 8px 32px 0 rgba(31, 38, 135, 0.18)',
    card: '0 4px 24px rgba(44, 62, 80, 0.12)',
    button: '0 2px 8px rgba(44, 62, 80, 0.08)',
  },
  styles: {
    global: (props: any) => ({
      body: {
        bg: props.colorMode === 'dark'
          ? 'linear-gradient(135deg, #101227 0%, #232a5e 100%)'
          : 'linear-gradient(135deg, #f5f8ff 0%, #fff7ed 100%)',
        color: props.colorMode === 'dark' ? 'gray.100' : 'gray.800',
        fontFamily: 'Inter, SF Pro Text, Poppins, sans-serif',
        minHeight: '100vh',
      },
      '.glass-card': {
        background: props.colorMode === 'dark'
          ? 'rgba(24,29,58,0.7)'
          : 'rgba(255,255,255,0.7)',
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.18)',
        backdropFilter: 'blur(18px)',
        borderRadius: '2xl',
        border: '1px solid rgba(255,255,255,0.18)',
      },
      '.premium-btn': {
        background: 'linear-gradient(90deg, #4c5fc4 0%, #ff6a1c 100%)',
        color: '#fff',
        fontWeight: 700,
        borderRadius: 'xl',
        boxShadow: '0 2px 8px rgba(44, 62, 80, 0.08)',
        transition: 'all 0.2s cubic-bezier(.4,0,.2,1)',
        _hover: {
          filter: 'brightness(1.08)',
          transform: 'translateY(-2px) scale(1.03)',
          boxShadow: '0 4px 24px rgba(44, 62, 80, 0.18)',
        },
      },
      '::-webkit-scrollbar': {
        width: '8px',
        background: 'rgba(44,62,80,0.06)',
      },
      '::-webkit-scrollbar-thumb': {
        background: props.colorMode === 'dark' ? '#232a5e' : '#b6c7f7',
        borderRadius: '8px',
      },
      '::selection': {
        background: '#4c5fc4',
        color: '#fff',
      },
    }),
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: 700,
        borderRadius: 'xl',
        letterSpacing: '0.02em',
      },
      variants: {
        solid: (props: any) => ({
          bg: props.colorMode === 'dark'
            ? 'linear-gradient(90deg, #4c5fc4 0%, #ff6a1c 100%)'
            : 'linear-gradient(90deg, #7a8fe7 0%, #ff9b4b 100%)',
          color: '#fff',
          _hover: {
            filter: 'brightness(1.08)',
            transform: 'translateY(-2px) scale(1.03)',
            boxShadow: '0 4px 24px rgba(44, 62, 80, 0.18)',
          },
        }),
      },
    },
    Card: {
      baseStyle: {
        borderRadius: '2xl',
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.18)',
        bg: 'glass.100',
        border: '1px solid rgba(255,255,255,0.18)',
      },
    },
  },
});

export default theme;
