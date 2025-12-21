import type { ModuleOptions } from '../types'

export const defaultVuetifyOptions: ModuleOptions['vuetifyOptions'] = {
  defaults: {
    global: {
      ripple: true,
    },
  },
  dateAdapter: 'dayjs',
  display: {
    mobileBreakpoint: 'md',
    thresholds: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
      xxl: 2560,
    },
  },
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        dark: false,
        colors: {
          'primary': '#1976D2',
          'primary-darken-1': '#1565C0',
          'secondary': '#424242',
          'secondary-darken-1': '#3d3d3d',
          'accent': '#82B1FF',
          'error': '#FF5252',
          'info': '#2196F3',
          'success': '#4CAF50',
          'warning': '#FB8C00',
          'background': '#FAFAFA',
          'surface': '#FFFFFF',
          'surface-bright': '#FFFFFF',
          'surface-variant': '#E0E0E0',
          'on-surface-variant': '#424242',
        },
      },
      dark: {
        dark: true,
        colors: {
          'primary': '#2196F3',
          'primary-darken-1': '#1E88E5',
          'secondary': '#424242',
          'secondary-darken-1': '#3d3d3d',
          'accent': '#FF4081',
          'error': '#FF5252',
          'info': '#2196F3',
          'success': '#4CAF50',
          'warning': '#FB8C00',
          'background': '#121212',
          'surface': '#212121',
          'surface-bright': '#2C2C2C',
          'surface-variant': '#424242',
          'on-surface-variant': '#EEEEEE',
        },
      },
    },
  },
  icons: {
    defaultSet: 'mdi',
    aliases: {},
  },
  locale: {
    locale: 'en',
    fallback: 'en',
  },
  ssr: true,
}
