/* eslint-disable @typescript-eslint/no-empty-object-type */
import type { VuetifyRuntimeConfig } from './options'
import type { Vuetify } from 'vuetify'
import type { VuetifyHooks } from './hooks'

declare module '#app' {
  interface PublicRuntimeConfig {
    vuetify: VuetifyRuntimeConfig
  }

  interface NuxtApp {
    $vuetify: Vuetify
  }

  interface RuntimeNuxtHooks extends VuetifyHooks {}
}

declare module '@nuxt/schema' {
  interface PublicRuntimeConfig {
    vuetify: VuetifyRuntimeConfig
  }

  interface NuxtHooks extends VuetifyHooks {}
}

declare module 'nuxt/schema' {
  interface PublicRuntimeConfig {
    vuetify: VuetifyRuntimeConfig
  }

  interface NuxtHooks extends VuetifyHooks {}
}

declare module 'vue' {
  interface ComponentCustomProperties {
    $vuetify: Vuetify
  }
}

export {}
