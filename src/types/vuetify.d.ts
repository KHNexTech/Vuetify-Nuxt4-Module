// types/vuetify-hooks.d.ts
import type { createVuetify } from 'vuetify'
import type { HookResult } from '@nuxt/schema'
import type { ModuleOptions } from './options'
import type { VuetifyHookContext } from './hooks'

declare module '#app' {
  interface RuntimeNuxtHooks {
    'vuetify:register': (registerModule: (options: Partial<ModuleOptions>) => void) => HookResult
    'vuetify:before-create': (context: VuetifyHookContext) => HookResult
    'vuetify:configuration': (context: VuetifyHookContext) => HookResult
    'vuetify:ready': (vuetify: ReturnType<typeof createVuetify>) => HookResult
  }
  interface PublicRuntimeConfig {
    vuetify: VuetifyRuntimeConfig
  }

  interface NuxtApp {
    $vuetify: ReturnType<typeof createVuetify>
  }
}

declare module '@nuxt/schema' {
  interface NuxtHooks {
    'vuetify:before-create': (context: VuetifyHookContext) => HookResult
    'vuetify:configuration': (context: VuetifyHookContext) => HookResult
    'vuetify:ready': (vuetify: ReturnType<typeof createVuetify>) => HookResult
  }
  interface PublicRuntimeConfig {
    vuetify: VuetifyRuntimeConfig
  }
}
declare module 'nuxt/schema' {
  interface NuxtHooks {
    'vuetify:before-create': (context: VuetifyHookContext) => HookResult
    'vuetify:configuration': (context: VuetifyHookContext) => HookResult
    'vuetify:ready': (vuetify: ReturnType<typeof createVuetify>) => HookResult
  }
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
