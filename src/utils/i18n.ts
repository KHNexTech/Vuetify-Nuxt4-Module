import type { LocaleOptions } from 'vuetify'
import type { ModuleOptions } from '../types'
import { logger } from './logger'

/**
 * Check if i18n integration is enabled in module options
 */
export function isI18nEnabled(i18nOption?: ModuleOptions['i18n']): boolean {
  if (i18nOption === false) {
    return false
  }

  if (i18nOption === true) {
    return true
  }

  // Object form: check useVueI18nAdapter
  if (typeof i18nOption === 'object' && i18nOption) {
    return i18nOption.useVueI18nAdapter !== false
  }

  // Default: enabled (auto-detect)
  return true
}

/**
 * Create vue-i18n adapter for Vuetify locale
 * Supports both @nuxtjs/i18n ($i18n instance) and standalone vue-i18n (useI18n composable)
 */
export async function createI18nLocaleAdapter(): Promise<LocaleOptions | undefined> {
  try {
    // First, try to get $i18n from @nuxtjs/i18n
    let i18nInstance: Record<string, unknown> | undefined

    try {
      const { useNuxtApp } = await import('#app')
      const nuxtApp = useNuxtApp()
      i18nInstance = nuxtApp.$i18n as Record<string, unknown> | undefined
    }
    catch {
      // Not available or not in Nuxt context
      i18nInstance = undefined
    }

    // Import required dependencies
    const { createVueI18nAdapter } = await import('vuetify/locale/adapters/vue-i18n')

    // Dynamically import vue-i18n with proper error handling
    let useI18n: unknown
    try {
      const vueI18nModule = await import('vue-i18n')

      useI18n = vueI18nModule.useI18n
    }
    catch {
      logger.warn(
        'vue-i18n not available. Install vue-i18n or @nuxtjs/i18n to use i18n adapter.\n'
        + 'Falling back to default Vuetify locale.',
      )
      return undefined
    }

    // Create adapter with appropriate parameters
    if (i18nInstance) {
      // @nuxtjs/i18n detected - use the instance
      logger.debug('vue-i18n adapter: Using @nuxtjs/i18n instance')
      return {

        adapter: createVueI18nAdapter({ i18n: i18nInstance, useI18n } as any),
      }
    }
    else {
      // Standalone vue-i18n - use composable
      logger.debug('vue-i18n adapter: Using standalone vue-i18n composable')
      return {

        adapter: createVueI18nAdapter({ useI18n } as any),
      }
    }
  }
  catch (error) {
    logger.warn(
      'vue-i18n adapter failed to load.\n'
      + 'Falling back to default Vuetify locale.',
    )
    logger.error(error as Error, 'vue-i18n initialization error')
    return undefined
  }
}
