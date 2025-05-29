import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  colors: {
    brand: {
      50: '#f0f9ff',
      100: '#e0f2fe',
      200: '#bae6fd',
      300: '#7dd3fc',
      400: '#38bdf8',
      500: '#0ea5e9',
      600: '#0284c7',
      700: '#0369a1',
      800: '#075985',
      900: '#0c4a6e',
    },
    accent: {
      50: '#f0fdf4',
      100: '#dcfce7',
      200: '#bbf7d0',
      300: '#86efac',
      400: '#4ade80',
      500: '#22c55e',
      600: '#16a34a',
      700: '#15803d',
      800: '#166534',
      900: '#14532d',
    },
    gray: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827',
    },
  },
  fonts: {
    heading: `'Inter', sans-serif`,
    body: `'Inter', sans-serif`,
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: 'semibold',
        borderRadius: 'lg',
      },
      variants: {
        solid: (props: any) => ({
          bg: props.colorMode === 'dark' ? 'brand.500' : 'brand.600',
          color: 'white',
          _hover: {
            bg: props.colorMode === 'dark' ? 'brand.600' : 'brand.700',
            transform: 'translateY(-1px)',
            boxShadow: 'lg',
          },
          _active: {
            bg: props.colorMode === 'dark' ? 'brand.700' : 'brand.800',
            transform: 'translateY(0)',
          },
        }),
        outline: (props: any) => ({
          borderColor: 'brand.500',
          color: props.colorMode === 'dark' ? 'brand.100' : 'brand.600',
          _hover: {
            bg: props.colorMode === 'dark' ? 'brand.800' : 'brand.50',
            transform: 'translateY(-1px)',
          },
          _active: {
            bg: props.colorMode === 'dark' ? 'brand.700' : 'brand.100',
            transform: 'translateY(0)',
          },
        }),
      },
    },
    Card: {
      baseStyle: (props: any) => ({
        container: {
          bg: props.colorMode === 'dark' ? 'gray.800' : 'white',
          borderRadius: 'xl',
          boxShadow: 'xl',
          overflow: 'hidden',
          transition: 'all 0.2s',
          _hover: {
            transform: 'translateY(-4px)',
            boxShadow: '2xl',
          },
        },
      }),
    },
    Input: {
      baseStyle: {
        field: {
          borderRadius: 'lg',
        },
      },
      defaultProps: {
        focusBorderColor: 'brand.400',
      },
    },
    Select: {
      baseStyle: {
        field: {
          borderRadius: 'lg',
        },
      },
      defaultProps: {
        focusBorderColor: 'brand.400',
      },
    },
    Textarea: {
      baseStyle: {
        borderRadius: 'lg',
      },
      defaultProps: {
        focusBorderColor: 'brand.400',
      },
    },
  },
  styles: {
    global: (props: any) => ({
      'html, body': {
        bg: props.colorMode === 'dark' ? 'gray.900' : 'gray.50',
        color: props.colorMode === 'dark' ? 'white' : 'gray.800',
        lineHeight: 'tall',
      },
      '::selection': {
        bg: 'brand.100',
        color: 'brand.700',
      },
      '::-webkit-scrollbar': {
        width: '8px',
        height: '8px',
      },
      '::-webkit-scrollbar-track': {
        bg: props.colorMode === 'dark' ? 'gray.800' : 'gray.100',
      },
      '::-webkit-scrollbar-thumb': {
        bg: 'brand.500',
        borderRadius: 'full',
        '&:hover': {
          bg: 'brand.600',
        },
      },
    }),
  },
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false,
  },
});

export default theme;
