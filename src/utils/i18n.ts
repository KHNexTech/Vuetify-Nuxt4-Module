import type { I18nConfig, I18nLocaleAdapter } from '../types'
import { logger } from './logger'
import type { NuxtApp } from '#app'

/**
 * Check if i18n is enabled in module options
 */
export function isI18nEnabled(i18nOption?: boolean | I18nConfig): boolean {
  if (typeof i18nOption === 'boolean') return i18nOption
  if (typeof i18nOption === 'object') return i18nOption.adapter !== false
  return true
}

/**
 * Check if vue-i18n is available
 * Returns true if either vue-i18n or @nuxtjs/i18n is installed
 */
export async function hasVueI18n(): Promise<boolean> {
  try {
    await import('vue-i18n')
    return true
  }
  catch {
    return false
  }
}

/**
 * Get i18n instance from NuxtApp
 * Supports both @nuxtjs/i18n ($i18n) and custom vue-i18n setup
 *
 * @param nuxtApp - The Nuxt application instance
 * @returns The i18n instance or undefined
 */
export function getI18nInstance(nuxtApp: NuxtApp): unknown | undefined {
  // Check for @nuxtjs/i18n (provides $i18n on nuxtApp)
  if (nuxtApp.$i18n) {
    return nuxtApp.$i18n
  }

  // Check for vue-i18n installed globally on Vue app
  if (nuxtApp.vueApp?.config?.globalProperties?.$i18n) {
    return nuxtApp.vueApp.config.globalProperties.$i18n
  }

  return undefined
}

/**
 * Create a vue-i18n locale adapter for Vuetify
 *
 * Works with:
 * - @nuxtjs/i18n module (recommended)
 * - Standalone vue-i18n installation
 *
 * @param i18n - The vue-i18n instance
 * @returns The locale adapter or undefined if creation fails
 *
 * @example
 * ```typescript
 * // With @nuxtjs/i18n
 * const adapter = await createI18nLocaleAdapter(nuxtApp.$i18n)
 *
 * // With standalone vue-i18n
 * import { createI18n } from 'vue-i18n'
 * const i18n = createI18n({ ... })
 * const adapter = await createI18nLocaleAdapter(i18n)
 * ```
 */
export async function createI18nLocaleAdapter(i18n: unknown): Promise<I18nLocaleAdapter | undefined> {
  if (!i18n) {
    logger.debug('No i18n instance provided')
    return undefined
  }

  try {
    // Dynamic import to avoid errors when vue-i18n is not installed
    const [vueI18nAdapter, vueI18n] = await Promise.all([
      import('vuetify/locale/adapters/vue-i18n'),
      import('vue-i18n'),
    ])

    const { createVueI18nAdapter } = vueI18nAdapter
    const { useI18n } = vueI18n

    return createVueI18nAdapter({
      i18n: i18n as Parameters<typeof createVueI18nAdapter>[0]['i18n'],
      useI18n,
    }) as I18nLocaleAdapter
  }
  catch (error) {
    logger.debug(
      'Failed to create i18n adapter. Install @nuxtjs/i18n or vue-i18n to enable i18n support:',
      error,
    )
    return undefined
  }
}

/**
 * Try to create i18n adapter from NuxtApp
 * Automatically detects i18n instance from @nuxtjs/i18n or vue-i18n
 *
 * @param nuxtApp - The Nuxt application instance
 * @returns The locale adapter or undefined
 */
export async function tryCreateI18nLocaleAdapter(
  nuxtApp: NuxtApp,
): Promise<I18nLocaleAdapter | undefined> {
  const i18n = getI18nInstance(nuxtApp)

  console.log(i18n)

  if (!i18n) {
    logger.debug('No i18n instance found on nuxtApp q')
    return undefined
  }

  try {
    return await createI18nLocaleAdapter(i18n)
  }
  catch (error) {
    logger.debug('Failed to create i18n adapter:', error)
    return undefined
  }
}
