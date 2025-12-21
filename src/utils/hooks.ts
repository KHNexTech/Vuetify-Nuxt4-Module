import type { NuxtApp } from '#app'
import type { VuetifyHooks } from '../types'

export type VuetifyHookName = keyof VuetifyHooks

// Extract the first parameter type from hook function
type HookPayload<K extends VuetifyHookName> = Parameters<VuetifyHooks[K]>[0]

// Safe function types to avoid ESLint warnings
type HookCaller = <T>(name: string, arg: T) => Promise<void>
type HookRegistrar = <T>(name: string, callback: (arg: T) => void | Promise<void>) => void
type HookRemover = <T>(name: string, callback: (arg: T) => void | Promise<void>) => void

/**
 * Call a Vuetify hook with proper typing
 */
export function callVuetifyHook<K extends VuetifyHookName>(
  nuxtApp: NuxtApp,
  name: K,
  payload: HookPayload<K>,
): Promise<void> {
  return (nuxtApp.callHook as HookCaller)(name, payload)
}

/**
 * Register a Vuetify hook listener
 */
export function onVuetifyHook<K extends VuetifyHookName>(
  nuxtApp: NuxtApp,
  name: K,
  callback: (payload: HookPayload<K>) => void | Promise<void>,
): void {
  (nuxtApp.hook as HookRegistrar)(name, callback)
}

/**
 * Remove a Vuetify hook listener
 */
export function offVuetifyHook<K extends VuetifyHookName>(
  nuxtApp: NuxtApp,
  name: K,
  callback: (payload: HookPayload<K>) => void | Promise<void>,
): void {
  ;(nuxtApp.hooks?.removeHook as HookRemover)?.(name, callback)
}
