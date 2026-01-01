import type { NuxtApp } from '#app'
import type { VuetifyHookName, VuetifyHooks } from '../node'
import { logger } from './logger'

// Extract the first parameter type from a hook function
type HookPayload<K extends VuetifyHookName> = Parameters<VuetifyHooks[K]>[0]

// Safe function types to avoid ESLint warnings
type HookCaller = <T>(name: string, arg: T) => Promise<void>
type HookRegistrar = <T>(name: string, callback: (arg: T) => void | Promise<void>) => void
type HookRemover = <T>(name: string, callback: (arg: T) => void | Promise<void>) => void

/**
 * Call a Vuetify hook with proper typing
 */
export async function callVuetifyHook<K extends VuetifyHookName>(
  nuxtApp: NuxtApp,
  name: K,
  payload: HookPayload<K>,
): Promise<void> {
  try {
    await (nuxtApp.callHook as HookCaller)(name, payload)
  }
  catch (error) {
    logger.debug(`Hook ${name} error:`, error)
  }
}

/**
 * Register a Vuetify hook listener
 */
export function onVuetifyHook<K extends VuetifyHookName>(
  nuxtApp: NuxtApp,
  name: K,
  callback: (payload: HookPayload<K>) => (void | Promise<void>),
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
