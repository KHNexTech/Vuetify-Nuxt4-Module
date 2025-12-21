export default defineNuxtConfig({
  modules: ['../src/module'],
  ssr: true,
  devtools: { enabled: true },
  compatibilityDate: '2025-12-20',
  // Hook example in config
  hooks: {
    'vuetify:before-create': ({ vuetifyOptions }) => {
      console.log('Vuetify options:', vuetifyOptions)
    },
  },
  vuetify: {
    vuetifyOptions: {
      ssr: true,
      blueprint: 'md3',
      dateAdapter: 'vuetify',
      icons: {
        defaultSet: 'mdi',
        aliases: {
          myHeart: 'mdi-heart',
        },
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
      labs: true,
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
