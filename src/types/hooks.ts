import type { createVuetify, VuetifyOptions } from 'vuetify'
import type { HookResult } from '@nuxt/schema'
import type { ModuleOptions } from './options'

export interface VuetifyHookContext {
  vuetifyOptions: VuetifyOptions
}

// Define hook types locally
export type VuetifyHooks = {
  'vuetify:register': (registerModule: (options: Partial<ModuleOptions>) => void) => HookResult
  'vuetify:before-create': (context: VuetifyHookContext) => HookResult
  'vuetify:configuration': (context: VuetifyHookContext) => HookResult
  'vuetify:ready': (vuetify: ReturnType<typeof createVuetify>) => HookResult
}
