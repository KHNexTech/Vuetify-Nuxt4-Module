import { useNuxtApp } from '#app'
import { computed } from 'vue'

export function useVuetify() {
  const { $vuetify } = useNuxtApp()

  return {
    // Core
    vuetify: $vuetify,
    theme: $vuetify.theme,
    locale: $vuetify.locale,
    display: $vuetify.display,
    defaults: $vuetify.defaults,

    // Computed helpers
    isDark: computed(() => $vuetify.theme.global.current.value.dark),
    isMobile: computed(() => $vuetify.display.mobile.value),
    currentBreakpoint: computed(() => $vuetify.display.name.value),
    currentTheme: computed(() => $vuetify.theme.global.name.value),
    currentLocale: computed(() => $vuetify.locale.current.value),

    toggleTheme() {
      $vuetify.theme.change($vuetify.theme.global.current.value.dark ? 'light' : 'dark')
    },

    setTheme(name: string) {
      $vuetify.theme.global.name.value = name
    },

    setLocale(locale: string) {
      $vuetify.locale.current.value = locale
    },
  }
}
