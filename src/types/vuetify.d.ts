import type { createVuetify } from 'vuetify'

declare module '#app' {
  interface PublicRuntimeConfig {
    vuetify: VuetifyRuntimeConfig
  }

  interface NuxtApp {
    $vuetify: ReturnType<typeof createVuetify>
  }
}

declare module '@nuxt/schema' {
  interface PublicRuntimeConfig {
    vuetify: VuetifyRuntimeConfig
  }
}
declare module 'nuxt/schema' {
  interface PublicRuntimeConfig {
    vuetify: VuetifyRuntimeConfig
  }
}

declare module 'vue' {
  interface ComponentCustomProperties {
    $vuetify: Vuetify
  }
}

export {}
