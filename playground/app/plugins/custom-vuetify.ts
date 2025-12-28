import type { NuxtApp } from '#app'

export default defineNuxtPlugin((nuxtApp) => {
  onVuetifyHook(nuxtApp as NuxtApp, 'vuetify:register', (registerModule) => {
    // Register additional Vuetify configuration
    registerModule({
      vuetifyOptions: {
        icons: {
          defaultSet: 'mdi',
        },
        theme: {
          defaultTheme: 'dark',
        },
      },
    })
  })

  // Modify options before Vuetify is created
  onVuetifyHook(nuxtApp as NuxtApp, 'vuetify:before-create', ({ vuetifyOptions }) => {
    // console.log('Before create:', vuetifyOptions)

    // Add custom defaults
    vuetifyOptions.defaults = {
      ...vuetifyOptions.defaults,
      VAlert: {
        variant: 'tonal',
        rounded: 'lg',
      },
    }
  })

  // When Vuetify is ready
  onVuetifyHook(nuxtApp as NuxtApp, 'vuetify:ready', (vuetify) => {
    console.log('Vuetify ready!')
    console.log('Current theme:', vuetify.theme.global.name.value)

    // Restore saved theme
    if (import.meta.client) {
      const savedTheme = localStorage.getItem('theme')
      if (savedTheme) {
        vuetify.theme.change(savedTheme)
      }

      // Watch for theme changes
      watch(
        () => vuetify.theme.global.name.value,
        (theme) => {
          localStorage.setItem('theme', theme)
        },
      )
    }
  })
})
