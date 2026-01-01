import type { VuetifyOptions, createVuetify } from 'vuetify'
import type { HookResult } from '@nuxt/schema'
import type { ModuleOptions } from '../module'

export interface VuetifyHookContext {
  vuetifyOptions: VuetifyOptions
}
export interface ModuleHooks {
  'vuetify:register': (registerModule: (options: Partial<ModuleOptions>) => void) => HookResult
}
export interface ModuleRuntimeHooks {
  'vuetify:before-create': (context: VuetifyHookContext) => HookResult
  'vuetify:configuration': (context: VuetifyHookContext) => HookResult
  'vuetify:ready': (vuetify: ReturnType<typeof createVuetify>) => HookResult
}
export type VuetifyHooks = ModuleRuntimeHooks & ModuleHooks
export type VuetifyHookName = keyof VuetifyHooks

export {}
