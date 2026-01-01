export default defineNuxtConfig({
  modules: ['@nuxtjs/i18n', '../src/module'],
  ssr: true,
  devtools: { enabled: true },
  // Performance settings
  experimental: {
    payloadExtraction: true,
    renderJsonPayloads: true,
    viewTransition: true,
  },
  compatibilityDate: '2025-12-20',
  nitro: {
    compressPublicAssets: true,
    minify: true,
  },

  vite: {
    build: {
      cssMinify: 'lightningcss',
      rollupOptions: {
        output: {
          experimentalMinChunkSize: 10000,
        },
      },
    },
  },
  i18n: {
    defaultLocale: 'en',
    locales: [
      { code: 'en', name: 'English', file: 'en.js' },
      { code: 'km', name: 'ភាសាខ្មែរ', file: 'kh.js' },
    ],
  },
  vuetify: {
    vuetifyOptions: {
      ssr: true,
      blueprint: 'md3',
      dateAdapter: 'vuetify',
      icons: {
        defaultSet: 'mdi',
      },
      locale: {
        locale: 'en',
        fallback: 'en',
      },
      theme: {
        defaultTheme: 'light',
        themes: {
          light: {
            colors: {
              primary: '#6200EE',
              secondary: '#03DAC6',
              error: '#B00020',
            },
          },
          dark: {
            colors: {
              primary: '#BB86FC',
              secondary: '#03DAC6',
              error: '#CF6679',
            },
          },
        },
      },
      defaults: {
        VBtn: {
          variant: 'elevated',
          rounded: 'lg',
        },
        VCard: {
          elevation: 4,
          rounded: 'lg',
        },
        VTextField: {
          variant: 'outlined',
          density: 'comfortable',
        },
      },
    },
    importComposables: true,
    prefixComposables: false,
    transformAssetUrls: true,
    autoImport: {
      labs: false,
    },
    styles: true,

    persistence: {
      enabled: true,
      key: 'my-app-theme',
      storage: 'cookie',
      cookieOptions: {
        maxAge: 60 * 60 * 24 * 365,
        path: '/',
        sameSite: 'lax',
      },
    },
  },
})
